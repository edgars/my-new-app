'use server'

import { redirect } from 'next/navigation'

import { registrarAuditoria, ACAO } from '@/server/audit/registrar'
import {
  autenticar,
  encerrarSessao,
  gravarCookieDeSessao,
  limparSessoesVencidas,
  lerSessao,
} from '@/server/auth/sessao'

export interface EstadoLogin {
  erro?: string
}

export async function entrar(
  _estado: EstadoLogin,
  form: FormData,
): Promise<EstadoLogin> {
  const login = String(form.get('login') ?? '').trim()
  const senha = String(form.get('senha') ?? '')
  const de = String(form.get('de') ?? '/')

  if (!login || !senha) return { erro: 'Informe login e senha.' }

  const sessao = await autenticar(login, senha)
  // Mensagem única para usuário inexistente, senha errada e conta inativa:
  // distinguir os casos entrega ao atacante quais logins existem.
  if (!sessao) return { erro: 'Login ou senha inválidos.' }

  await gravarCookieDeSessao(sessao.id, sessao.expiraEm)
  void limparSessoesVencidas()

  const usuario = await lerSessao()
  if (usuario) {
    await registrarAuditoria(usuario, {
      codAcao: ACAO.LOGIN,
      codModulo: 'AUTH',
      desAcao: 'Entrada no sistema',
      tipoEntidade: 'Usuario',
      idEntidade: usuario.id,
    })
  }

  // Só caminho interno: `de` vem da query string e um valor como
  // '//evil.example' viraria redirecionamento para fora.
  redirect(de.startsWith('/') && !de.startsWith('//') ? de : '/')
}

export async function sair(): Promise<void> {
  await encerrarSessao()
  redirect('/login')
}
