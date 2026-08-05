import { NextResponse } from 'next/server'

import { entidadePorChave } from '@/lib/entidades'
import { statusDoErro } from '@/lib/erros'
import { schemaDeBusca } from '@/lib/schemas'
import { criar, listar } from '@/server/crud/servico'

import { respostaDeErro } from '../_erro'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ entidade: string }> },
) {
  const e = entidadePorChave((await params).entidade)
  if (!e) return NextResponse.json({ erro: 'Entidade desconhecida.' }, { status: 404 })

  try {
    const url = new URL(req.url)
    const busca = schemaDeBusca.parse({
      q: url.searchParams.get('q') ?? undefined,
      pagina: url.searchParams.get('pagina') ?? 1,
      tamanho: url.searchParams.get('tamanho') ?? 20,
    })
    return NextResponse.json(await listar(e, busca))
  } catch (erro) {
    return respostaDeErro(erro, statusDoErro(erro))
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ entidade: string }> },
) {
  const e = entidadePorChave((await params).entidade)
  if (!e) return NextResponse.json({ erro: 'Entidade desconhecida.' }, { status: 404 })

  try {
    const corpo = await req.json().catch(() => ({}))
    const r = await criar(e, corpo)
    return NextResponse.json(r, { status: 201 })
  } catch (erro) {
    return respostaDeErro(erro, statusDoErro(erro))
  }
}
