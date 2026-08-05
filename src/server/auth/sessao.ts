import 'server-only'

import { randomBytes } from 'node:crypto'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { NaoAutorizado } from '@/lib/erros'
import { db } from '@/server/db/client'

import { conferirSenha } from './senha'

/**
 * Sessão — NOVO, não existe na fonte. Ver docs/build/02-divergences.md S-05.
 *
 * O legado não expôs autenticação no material extraído, mas gravava usrInclusao,
 * usrUltAlteracao, usrEvento, codPerfil e codLotacao: havia usuário identificado.
 * Um CRUD de CPF, renda familiar, biometria e conta bancária sem auth é
 * inaceitável no rigor "produção".
 *
 * Sessão opaca em banco, não JWT: revogar é um DELETE, e o token no cookie não
 * carrega nenhuma informação.
 */

export const COOKIE_SESSAO = 'sifap_sessao'
const DURACAO_MS = 8 * 60 * 60 * 1000 // 8 horas — um turno de trabalho

export interface UsuarioAutenticado {
  id: number
  login: string
  nome: string
  codPerfil: string
  codLotacao: string | null
  idSessao: string
}

export async function autenticar(
  login: string,
  senha: string,
): Promise<{ id: string; expiraEm: Date } | null> {
  const usuario = await db.usuario.findUnique({ where: { login } })

  // Confere a senha mesmo com usuário inexistente, contra um hash descartável.
  // Sair cedo aqui deixaria o tempo de resposta revelar quais logins existem.
  const hash = usuario?.senhaHash ?? 'scrypt$00$00'
  const senhaConfere = await conferirSenha(senha, hash)

  if (!usuario || !usuario.ativo || !senhaConfere) return null

  const id = randomBytes(32).toString('hex')
  const expiraEm = new Date(Date.now() + DURACAO_MS)
  await db.sessao.create({ data: { id, usuarioId: usuario.id, expiraEm } })

  return { id, expiraEm }
}

export async function gravarCookieDeSessao(id: string, expiraEm: Date): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE_SESSAO, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiraEm,
  })
}

/** Devolve o usuário da sessão, ou null. Não lança — quem exige é o guard. */
export async function lerSessao(): Promise<UsuarioAutenticado | null> {
  const jar = await cookies()
  const id = jar.get(COOKIE_SESSAO)?.value
  if (!id) return null

  const sessao = await db.sessao.findUnique({
    where: { id },
    include: { usuario: true },
  })
  if (!sessao) return null

  if (sessao.expiraEm.getTime() < Date.now()) {
    await db.sessao.delete({ where: { id } }).catch(() => {})
    return null
  }
  if (!sessao.usuario.ativo) return null

  return {
    id: sessao.usuario.id,
    login: sessao.usuario.login,
    nome: sessao.usuario.nome,
    codPerfil: sessao.usuario.codPerfil,
    codLotacao: sessao.usuario.codLotacao,
    idSessao: sessao.id,
  }
}

export async function encerrarSessao(): Promise<void> {
  const jar = await cookies()
  const id = jar.get(COOKIE_SESSAO)?.value
  if (id) await db.sessao.delete({ where: { id } }).catch(() => {})
  jar.delete(COOKIE_SESSAO)
}

/**
 * Fail-closed. **Toda** leitura e escrita passa por aqui.
 *
 * O middleware sozinho não basta: ele checa a presença do cookie, não a validade
 * da sessão, e uma rota nova que o matcher não cubra ficaria aberta em silêncio.
 * Esta função é a autoridade — negar é o padrão, autorizar é a exceção provada.
 */
export async function exigirUsuario(): Promise<UsuarioAutenticado> {
  const usuario = await lerSessao()
  if (!usuario) throw new NaoAutorizado()
  return usuario
}

/** Remove sessões vencidas. Chamada oportunista no login. */
export async function limparSessoesVencidas(): Promise<void> {
  await db.sessao.deleteMany({ where: { expiraEm: { lt: new Date() } } }).catch(() => {})
}

/**
 * Versão para telas: em vez de lançar 401, manda para o login guardando o
 * destino. Lançar aqui daria 500 na cara do usuário — provado em dev antes de
 * existir esta função.
 *
 * A borda HTTP (rotas de API) continua usando `exigirUsuario`, que lança:
 * cliente de API quer status, não redirecionamento.
 */
export async function exigirUsuarioNaTela(destino = '/'): Promise<UsuarioAutenticado> {
  const usuario = await lerSessao()
  if (usuario) return usuario
  redirect(`/login?de=${encodeURIComponent(destino)}`)
}
