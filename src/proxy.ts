import { NextResponse, type NextRequest } from 'next/server'

/**
 * Fail-closed na borda: nega por padrão, libera por exceção explícita.
 *
 * Arquivo `proxy.ts`, não `middleware.ts`: o Next 16 depreciou a convenção antiga
 * ("The \"middleware\" file convention is deprecated. Please use \"proxy\" instead").
 * E precisa estar em `src/` — na raiz, com diretório src/, ele simplesmente não roda.
 *
 * Isto é a **primeira** camada, não a autoridade. O middleware só vê o cookie —
 * não sabe se a sessão é válida, nem se o usuário foi desativado. Quem decide é
 * `exigirUsuario()` em src/server/auth/sessao.ts, chamada por toda leitura e
 * escrita do serviço.
 *
 * Os dois existem porque protegem coisas diferentes: aqui evita-se renderizar
 * tela para quem não entrou; lá garante-se que nenhum dado sai ou entra sem
 * sessão, inclusive por POST direto que nunca passou por tela nenhuma.
 */

const PUBLICAS = ['/login']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLICAS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next()
  }

  const temCookie = req.cookies.has('sifap_sessao')
  if (temCookie) return NextResponse.next()

  // API responde 401 em JSON; tela redireciona para o login.
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ erro: 'Autenticação obrigatória.' }, { status: 401 })
  }

  const destino = new URL('/login', req.url)
  destino.searchParams.set('de', pathname)
  return NextResponse.redirect(destino)
}

export const config = {
  // Tudo, menos estáticos do Next e o favicon. Rota nova nasce protegida.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
