/**
 * Regras de Beneficiário.  INV-01 a INV-08, INV-10.
 *
 * Único bloco em que docs/prd.md preservou condições literais. Cada função cita
 * o FR de origem.
 *
 * A parte pura (validarBeneficiario) não toca em banco. A parte que depende do
 * estado do banco (INV-07, INV-08) recebe `tx` e roda dentro de transação.
 */

import { ehYyyymmddValida } from '@/lib/dates'

import { MENSAGEM_CPF, normalizarCpf, validarCpf } from './cpf'
import { calcularIdade, idadeAcimaDoLimite, IDADE_LIMITE_ALERTA } from './idade'
import { OPER, operValida, type Oper } from './status'

export interface Problema {
  campo: string | null
  mensagem: string
  /** Ver divergência D-05: a severidade foi lida do sentido da regra, não do extrator. */
  bloqueia: boolean
  /** FR de origem em docs/prd.md. */
  origem: string
}

export interface DadosBeneficiario {
  numCpf?: string | null
  nomeCompleto?: string | null
  dtNascimento?: number | null
  sexo?: string | null
}

export interface ResultadoValidacao {
  problemas: Problema[]
  erros: Problema[]
  avisos: Problema[]
  ok: boolean
}

/**
 * Valida os dados de um beneficiário. Puro.
 *
 * Nota sobre severidade: docs/prd.md marca **todas** as 24 regras como
 * `Severity: WARN`, inclusive `#CPF = 0`, que obviamente bloqueia. Uniformidade
 * de 100% é default de extrator, não decisão de negócio — então a severidade
 * aqui vem do sentido de cada regra. Registrado em D-05.
 */
export function validarBeneficiario(
  dados: DadosBeneficiario,
  contexto: { anoAtual: number },
): ResultadoValidacao {
  const problemas: Problema[] = []

  // INV-02 / FR-10 — `#CPF = 0`
  const cpfLimpo = normalizarCpf(dados.numCpf)
  if (!cpfLimpo || Number(cpfLimpo) === 0) {
    problemas.push({
      campo: 'numCpf',
      mensagem: 'CPF é obrigatório e não pode ser zero.',
      bloqueia: true,
      origem: 'FR-10',
    })
  } else {
    // INV-03 / FR-11 — `NOT #CPF-VALIDO`
    const r = validarCpf(cpfLimpo)
    if (!r.valido) {
      problemas.push({
        campo: 'numCpf',
        mensagem: MENSAGEM_CPF[r.motivo],
        bloqueia: true,
        origem: r.motivo === 'DIGITOS_REPETIDOS' ? 'NOVO (ver cpf.ts)' : 'FR-11',
      })
    }
  }

  // INV-04 / FR-12 — `#NOME = ' '`
  if (!dados.nomeCompleto || dados.nomeCompleto.trim() === '') {
    problemas.push({
      campo: 'nomeCompleto',
      mensagem: 'Nome é obrigatório.',
      bloqueia: true,
      origem: 'FR-12',
    })
  }

  // INV-05 / FR-13 — `#DT-NASC = 0`
  if (!dados.dtNascimento || dados.dtNascimento === 0) {
    problemas.push({
      campo: 'dtNascimento',
      mensagem: 'Data de nascimento é obrigatória.',
      bloqueia: true,
      origem: 'FR-13',
    })
  } else if (!ehYyyymmddValida(dados.dtNascimento)) {
    problemas.push({
      campo: 'dtNascimento',
      mensagem: 'Data de nascimento inválida.',
      bloqueia: true,
      origem: 'FR-13',
    })
  }

  // INV-06 / FR-14 — `#SEXO NE 'M' AND #SEXO NE 'F'`
  const sexo = dados.sexo?.toUpperCase() ?? ''
  if (sexo !== 'M' && sexo !== 'F') {
    problemas.push({
      campo: 'sexo',
      mensagem: "Sexo deve ser 'M' ou 'F'.",
      bloqueia: true,
      origem: 'FR-14',
    })
  }

  // INV-09 + INV-10 / FR-17, FR-19 — `#IDADE > 75`
  const idade = calcularIdade(dados.dtNascimento, contexto.anoAtual)
  if (idadeAcimaDoLimite(idade)) {
    problemas.push({
      campo: 'dtNascimento',
      mensagem: `Beneficiário com ${idade} anos — acima do limite de ${IDADE_LIMITE_ALERTA}.`,
      // Não bloqueia: é o único caso em que WARN faz sentido literal. Ver D-05.
      bloqueia: false,
      origem: 'FR-19',
    })
  }

  const erros = problemas.filter((p) => p.bloqueia)
  const avisos = problemas.filter((p) => !p.bloqueia)
  return { problemas, erros, avisos, ok: erros.length === 0 }
}

/** INV-01 / FR-09 — `#OPER NE 'I' AND #OPER NE 'A'`. */
export function validarOper(oper: string | null | undefined): Problema | null {
  if (operValida(oper)) return null
  return {
    campo: 'oper',
    mensagem: "Operação deve ser 'I' (inclusão) ou 'A' (alteração).",
    bloqueia: true,
    origem: 'FR-09',
  }
}

/**
 * INV-07 e INV-08 — as duas regras que dependem do banco.
 *
 *   FR-15  `#OPER = 'I' AND #FOUND`      → inclusão de CPF já existente é erro
 *   FR-16  `#OPER = 'A' AND NOT #FOUND`  → alteração de CPF inexistente é erro
 *
 * Recebe `tx` de propósito: a leitura tem que acontecer dentro da mesma
 * transação da escrita, senão outra requisição insere entre o SELECT e o INSERT.
 *
 * Ainda assim, isto **não basta sozinho**. O SQLite não tem `SELECT FOR UPDATE`;
 * a garantia final é o índice UNIQUE em `beneficiario.numCpf` (divergência D-04),
 * que transforma a corrida em erro de constraint em vez de duplicata silenciosa.
 * Quem chama deve tratar o erro de unicidade — ver `ehErroDeUnicidade`.
 */
export interface LeitorDeBeneficiario {
  findUnique(args: {
    where: { numCpf: string }
    select: { id: true }
  }): Promise<{ id: number } | null>
}

export async function verificarRegraDeOperacao(
  leitor: LeitorDeBeneficiario,
  params: { oper: Oper; numCpf: string },
): Promise<Problema | null> {
  const existente = await leitor.findUnique({
    where: { numCpf: normalizarCpf(params.numCpf) },
    select: { id: true },
  })

  if (params.oper === OPER.INCLUSAO && existente) {
    return {
      campo: 'numCpf',
      mensagem: 'Já existe beneficiário com este CPF.',
      bloqueia: true,
      origem: 'FR-15',
    }
  }

  if (params.oper === OPER.ALTERACAO && !existente) {
    return {
      campo: 'numCpf',
      mensagem: 'Não existe beneficiário com este CPF para alterar.',
      bloqueia: true,
      origem: 'FR-16',
    }
  }

  return null
}

/**
 * Reconhece a violação de UNIQUE que a corrida produz — a rede final de D-04.
 * P2002 é o código do Prisma para "unique constraint failed".
 */
export function ehErroDeUnicidade(erro: unknown): boolean {
  if (typeof erro !== 'object' || erro === null) return false
  const code = (erro as { code?: unknown }).code
  if (code === 'P2002') return true
  const msg = (erro as { message?: unknown }).message
  return typeof msg === 'string' && /UNIQUE constraint failed/i.test(msg)
}
