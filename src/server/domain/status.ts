/**
 * Máquinas de estado.  INV-37 a INV-39.
 *
 * ⚠ TODO — HUMANO PRECISA CONFIRMAR. Ponto a confirmar nº 1, impacto ALTO.
 *
 * O extrator preservou os `DECIDE ON` — ou seja, preservou **em qual campo** o
 * legado ramificava — e perdeu todos os ramos:
 *
 *   `DECIDE ON BENEFICIARIO-V.STATUS`      → INV-37
 *   `DECIDE ON PAGAMENTO-V.STATUS-PGTO`    → INV-38
 *   `DECIDE ON PAGAMENTO-V.TIPO-PGTO`      → INV-39 (campo nem existe no schema, ver D-06)
 *   `DECIDE ON AUDITORIA-V.ACAO`
 *
 * Tudo abaixo é [PRESUMIDO]. Os códigos e as transições são invenção desta
 * build. Extrair do banco legado (`SELECT DISTINCT`) antes de homologar.
 */

export interface Estado {
  codigo: string
  rotulo: string
}

/** INV-37 — [PRESUMIDO] `Beneficiario.sitBeneficiario`. */
export const SIT_BENEFICIARIO = {
  CADASTRADO: 'CA',
  ATIVO: 'AT',
  SUSPENSO: 'SU',
  CANCELADO: 'CN',
  ENCERRADO: 'EN',
} as const

export const ESTADOS_BENEFICIARIO: Estado[] = [
  { codigo: SIT_BENEFICIARIO.CADASTRADO, rotulo: 'Cadastrado' },
  { codigo: SIT_BENEFICIARIO.ATIVO, rotulo: 'Ativo' },
  { codigo: SIT_BENEFICIARIO.SUSPENSO, rotulo: 'Suspenso' },
  { codigo: SIT_BENEFICIARIO.CANCELADO, rotulo: 'Cancelado' },
  { codigo: SIT_BENEFICIARIO.ENCERRADO, rotulo: 'Encerrado' },
]

/** [PRESUMIDO] Transições permitidas. Cancelado e encerrado são terminais. */
export const TRANSICOES_BENEFICIARIO: Record<string, readonly string[]> = {
  CA: [SIT_BENEFICIARIO.ATIVO, SIT_BENEFICIARIO.CANCELADO],
  AT: [SIT_BENEFICIARIO.SUSPENSO, SIT_BENEFICIARIO.ENCERRADO, SIT_BENEFICIARIO.CANCELADO],
  SU: [SIT_BENEFICIARIO.ATIVO, SIT_BENEFICIARIO.ENCERRADO, SIT_BENEFICIARIO.CANCELADO],
  CN: [],
  EN: [],
}

/** INV-38 — [PRESUMIDO] `Pagamento.sitPagamento`. */
export const SIT_PAGAMENTO = {
  GERADO: 'GE',
  EMITIDO: 'EM',
  CONFIRMADO: 'CF',
  CONCILIADO: 'CC',
  CANCELADO: 'CA',
} as const

export const ESTADOS_PAGAMENTO: Estado[] = [
  { codigo: SIT_PAGAMENTO.GERADO, rotulo: 'Gerado' },
  { codigo: SIT_PAGAMENTO.EMITIDO, rotulo: 'Emitido' },
  { codigo: SIT_PAGAMENTO.CONFIRMADO, rotulo: 'Confirmado' },
  { codigo: SIT_PAGAMENTO.CONCILIADO, rotulo: 'Conciliado' },
  { codigo: SIT_PAGAMENTO.CANCELADO, rotulo: 'Cancelado' },
]

/**
 * [PRESUMIDO] Transições. A sequência sai da ordem das colunas de data do
 * próprio schema — dtGeracao, dtEmissao, dtConfirmacao, dtConciliacao — que é o
 * único vestígio de ordem que a fonte deixou. dtCancelamento existe em paralelo,
 * logo cancelar é possível de qualquer estado não terminal.
 */
export const TRANSICOES_PAGAMENTO: Record<string, readonly string[]> = {
  GE: [SIT_PAGAMENTO.EMITIDO, SIT_PAGAMENTO.CANCELADO],
  EM: [SIT_PAGAMENTO.CONFIRMADO, SIT_PAGAMENTO.CANCELADO],
  CF: [SIT_PAGAMENTO.CONCILIADO, SIT_PAGAMENTO.CANCELADO],
  CC: [],
  CA: [],
}

/** [PRESUMIDO] `Auditoria.codAcao`. */
export const COD_ACAO = {
  INCLUSAO: 'INC',
  ALTERACAO: 'ALT',
  EXCLUSAO: 'EXC',
  CONSULTA: 'CON',
  LOGIN: 'LOG',
} as const

export const ACOES_AUDITORIA: Estado[] = [
  { codigo: COD_ACAO.INCLUSAO, rotulo: 'Inclusão' },
  { codigo: COD_ACAO.ALTERACAO, rotulo: 'Alteração' },
  { codigo: COD_ACAO.EXCLUSAO, rotulo: 'Exclusão' },
  { codigo: COD_ACAO.CONSULTA, rotulo: 'Consulta' },
  { codigo: COD_ACAO.LOGIN, rotulo: 'Login' },
]

/**
 * INV-01 — `#OPER NE 'I' AND #OPER NE 'A'` (FR-09).
 * Este **veio com condição literal**, ao contrário do resto deste arquivo.
 */
export const OPER = { INCLUSAO: 'I', ALTERACAO: 'A' } as const
export type Oper = (typeof OPER)[keyof typeof OPER]

export function operValida(oper: string | null | undefined): oper is Oper {
  return oper === OPER.INCLUSAO || oper === OPER.ALTERACAO
}

/** Genérico: a transição é permitida? Estado atual ausente ⇒ é criação, libera. */
export function transicaoPermitida(
  tabela: Record<string, readonly string[]>,
  de: string | null | undefined,
  para: string | null | undefined,
): boolean {
  if (!para) return false
  if (!de) return true
  if (de === para) return true
  return (tabela[de] ?? []).includes(para)
}

export function rotuloDe(estados: Estado[], codigo: string | null | undefined): string {
  if (!codigo) return ''
  return estados.find((e) => e.codigo === codigo)?.rotulo ?? codigo
}
