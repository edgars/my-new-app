import 'server-only'

import { DadosInvalidos, NaoEncontrado } from '@/lib/erros'
import { hojeYyyymmdd, agoraHhmmss } from '@/lib/dates'
import type { EntidadeSpec } from '@/lib/entidades'
import { schemaDaEntidade, type Busca } from '@/lib/schemas'
import { registrarAuditoria, ACAO } from '@/server/audit/registrar'
import { exigirUsuario, type UsuarioAutenticado } from '@/server/auth/sessao'
import { db } from '@/server/db/client'
import { comRetryDeEscrita } from '@/server/db/retry'
import {
  alterarBeneficiario,
  inserirBeneficiario,
} from '@/server/domain/beneficiario-tx'
import { validarBeneficiario } from '@/server/domain/beneficiario'

/**
 * Serviço CRUD genérico — a camada de action do A1.
 *
 * Responsabilidade: **valida, transaciona, traduz erro, revalida**. Nada mais.
 * A regra de negócio continua em `src/server/domain/`; aqui ela é chamada, não
 * reimplementada.
 *
 * Fail-closed: toda função abaixo começa por `exigirUsuario()`. Não existe
 * caminho de leitura ou escrita que dispense sessão válida — nem o middleware
 * nem a UI são a autoridade.
 */

type Delegate = {
  findMany: (a: unknown) => Promise<Record<string, unknown>[]>
  findUnique: (a: unknown) => Promise<Record<string, unknown> | null>
  count: (a?: unknown) => Promise<number>
  create: (a: unknown) => Promise<Record<string, unknown>>
  update: (a: unknown) => Promise<Record<string, unknown>>
  delete: (a: unknown) => Promise<Record<string, unknown>>
}

function delegate(e: EntidadeSpec): Delegate {
  const d = (db as unknown as Record<string, Delegate>)[e.modelo]
  if (!d) throw new Error(`modelo desconhecido: ${e.modelo}`)
  return d
}

export interface Pagina<T> {
  itens: T[]
  total: number
  pagina: number
  tamanho: number
  paginas: number
}

function filtroDeBusca(e: EntidadeSpec, q?: string) {
  if (!q || e.busca.length === 0) return undefined
  return { OR: e.busca.map((campo) => ({ [campo]: { contains: q } })) }
}

export async function listar(
  e: EntidadeSpec,
  busca: Busca,
): Promise<Pagina<Record<string, unknown>>> {
  await exigirUsuario()

  const where = filtroDeBusca(e, busca.q)
  const [itens, total] = await Promise.all([
    delegate(e).findMany({
      where,
      orderBy: { id: 'desc' },
      skip: (busca.pagina - 1) * busca.tamanho,
      take: busca.tamanho,
    }),
    delegate(e).count(where ? { where } : undefined),
  ])

  return {
    itens,
    total,
    pagina: busca.pagina,
    tamanho: busca.tamanho,
    paginas: Math.max(1, Math.ceil(total / busca.tamanho)),
  }
}

export async function obter(
  e: EntidadeSpec,
  id: number,
): Promise<Record<string, unknown>> {
  await exigirUsuario()
  const item = await delegate(e).findUnique({ where: { id } })
  if (!item) throw new NaoEncontrado(`${e.singular} não encontrado.`)
  return item
}

/** Opções de pai para o <select> das entidades Grp (S-02). */
export async function opcoesDePai(
  e: EntidadeSpec,
): Promise<{ id: number; rotulo: string }[]> {
  if (!e.pai) return []
  await exigirUsuario()

  const d = (db as unknown as Record<string, Delegate>)[e.pai.entidade]!
  const linhas = await d.findMany({ orderBy: { id: 'asc' }, take: 500 })

  return linhas.map((l) => ({
    id: Number(l.id),
    rotulo:
      String(
        l.nomePrograma ?? l.nomeCompleto ?? l.numPagamento ?? l.codPrograma ?? l.id,
      ) + ` (#${l.id})`,
  }))
}

function validar(e: EntidadeSpec, dados: unknown) {
  const r = schemaDaEntidade(e).safeParse(dados)
  if (!r.success) {
    throw new DadosInvalidos(
      'Dados inválidos.',
      r.error.issues.map((i) => ({
        campo: i.path.join('.') || null,
        mensagem: i.message,
      })),
    )
  }
  return r.data as Record<string, unknown>
}

/** Carimbo de inclusão/alteração — os campos `usr*` e `dt*` que o legado mantinha. */
function carimbo(usuario: UsuarioAutenticado, e: EntidadeSpec, novo: boolean) {
  const nomes = new Set(e.campos.map((c) => c.nome))
  const marca: Record<string, unknown> = {}
  const agora = new Date()

  if (novo) {
    if (nomes.has('dtInclusao')) marca.dtInclusao = hojeYyyymmdd(agora)
    if (nomes.has('hrInclusao')) marca.hrInclusao = agoraHhmmss(agora)
    // O usuário vem da sessão, nunca do formulário: um POST direto poderia
    // forjar `usrInclusao` e a trilha apontaria para outra pessoa.
    if (nomes.has('usrInclusao')) marca.usrInclusao = usuario.login
  } else {
    if (nomes.has('dtUltAlteracao')) marca.dtUltAlteracao = hojeYyyymmdd(agora)
    if (nomes.has('hrUltAlteracao')) marca.hrUltAlteracao = agoraHhmmss(agora)
    if (nomes.has('usrUltAlteracao')) marca.usrUltAlteracao = usuario.login
  }
  return marca
}

/** Os campos `usr*` são do servidor. Nunca aceite o que o cliente mandar neles. */
function semCamposDeServidor(dados: Record<string, unknown>): Record<string, unknown> {
  const copia = { ...dados }
  delete copia.usrInclusao
  delete copia.usrUltAlteracao
  delete copia.dtInclusao
  delete copia.hrInclusao
  delete copia.dtUltAlteracao
  delete copia.hrUltAlteracao
  return copia
}

export async function criar(e: EntidadeSpec, entrada: unknown): Promise<{ id: number }> {
  const usuario = await exigirUsuario()
  const dados = semCamposDeServidor(validar(e, entrada))

  // Beneficiário passa pelo domínio: INV-01..10 e a corrida de FR-15.
  if (e.modelo === 'beneficiario') {
    const r = await inserirBeneficiario(
      db,
      { ...dados, ...carimbo(usuario, e, true) },
      { anoAtual: new Date().getFullYear(), usuario: usuario.login },
    )
    if (!r.ok) throw new DadosInvalidos('Dados inválidos.', r.problemas)
    await registrarAuditoria(usuario, {
      codAcao: ACAO.INCLUSAO,
      codModulo: e.modelo.toUpperCase(),
      desAcao: `Inclusão de ${e.singular}`,
      tipoEntidade: e.modelo,
      idEntidade: r.id,
      numCpfAfetado: String(dados.numCpf ?? ''),
    })
    return { id: r.id }
  }

  const criado = await comRetryDeEscrita(() =>
    delegate(e).create({
      data: { ...dados, ...carimbo(usuario, e, true) },
      select: { id: true },
    }),
  )
  const id = Number(criado.id)

  await registrarAuditoria(usuario, {
    codAcao: ACAO.INCLUSAO,
    codModulo: e.modelo.toUpperCase(),
    desAcao: `Inclusão de ${e.singular}`,
    tipoEntidade: e.modelo,
    idEntidade: id,
  })

  return { id }
}

export async function atualizar(
  e: EntidadeSpec,
  id: number,
  entrada: unknown,
): Promise<{ id: number }> {
  const usuario = await exigirUsuario()
  const dados = semCamposDeServidor(validar(e, entrada))

  if (e.modelo === 'beneficiario') {
    const numVersao = dados.numVersao != null ? Number(dados.numVersao) : null
    delete dados.numVersao
    const r = await alterarBeneficiario(
      db,
      id,
      { ...dados, ...carimbo(usuario, e, false) },
      { anoAtual: new Date().getFullYear(), usuario: usuario.login, numVersao },
    )
    if (!r.ok) throw new DadosInvalidos('Dados inválidos.', r.problemas)
    await registrarAuditoria(usuario, {
      codAcao: ACAO.ALTERACAO,
      codModulo: e.modelo.toUpperCase(),
      desAcao: `Alteração de ${e.singular}`,
      tipoEntidade: e.modelo,
      idEntidade: id,
      numCpfAfetado: String(dados.numCpf ?? ''),
    })
    return { id }
  }

  const existe = await delegate(e).findUnique({ where: { id }, select: { id: true } })
  if (!existe) throw new NaoEncontrado(`${e.singular} não encontrado.`)

  await comRetryDeEscrita(() =>
    delegate(e).update({ where: { id }, data: { ...dados, ...carimbo(usuario, e, false) } }),
  )

  await registrarAuditoria(usuario, {
    codAcao: ACAO.ALTERACAO,
    codModulo: e.modelo.toUpperCase(),
    desAcao: `Alteração de ${e.singular}`,
    tipoEntidade: e.modelo,
    idEntidade: id,
  })

  return { id }
}

/**
 * Exclusão.
 *
 * A confirmação que importa acontece **aqui**, no servidor: sessão válida e
 * registro existente. O diálogo da tela não protege nada — a Server Action e a
 * rota são alcançáveis por POST direto.
 */
export async function excluir(e: EntidadeSpec, id: number): Promise<{ id: number }> {
  const usuario = await exigirUsuario()

  const existe = await delegate(e).findUnique({ where: { id } })
  if (!existe) throw new NaoEncontrado(`${e.singular} não encontrado.`)

  await comRetryDeEscrita(() => delegate(e).delete({ where: { id } }))

  await registrarAuditoria(usuario, {
    codAcao: ACAO.EXCLUSAO,
    codModulo: e.modelo.toUpperCase(),
    desAcao: `Exclusão de ${e.singular}`,
    tipoEntidade: e.modelo,
    idEntidade: id,
    numCpfAfetado: typeof existe.numCpf === 'string' ? existe.numCpf : null,
  })

  return { id }
}

/** Avisos não bloqueantes para exibir na tela (INV-10). */
export function avisosDe(e: EntidadeSpec, dados: Record<string, unknown>): string[] {
  if (e.modelo !== 'beneficiario') return []
  const r = validarBeneficiario(
    {
      numCpf: dados.numCpf as string,
      nomeCompleto: dados.nomeCompleto as string,
      dtNascimento: dados.dtNascimento as number,
      sexo: dados.sexo as string,
    },
    { anoAtual: new Date().getFullYear() },
  )
  return r.avisos.map((a) => a.mensagem)
}
