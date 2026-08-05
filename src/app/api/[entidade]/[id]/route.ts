import { NextResponse } from 'next/server'

import { entidadePorChave } from '@/lib/entidades'
import { statusDoErro } from '@/lib/erros'
import { atualizar, excluir, obter } from '@/server/crud/servico'

import { respostaDeErro } from '../../_erro'

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ entidade: string; id: string }> }

async function resolver(ctx: Ctx) {
  const { entidade, id } = await ctx.params
  return { e: entidadePorChave(entidade), id: Number(id) }
}

export async function GET(_req: Request, ctx: Ctx) {
  const { e, id } = await resolver(ctx)
  if (!e || !Number.isInteger(id)) {
    return NextResponse.json({ erro: 'Rota inválida.' }, { status: 404 })
  }
  try {
    return NextResponse.json(await obter(e, id))
  } catch (erro) {
    return respostaDeErro(erro, statusDoErro(erro))
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  const { e, id } = await resolver(ctx)
  if (!e || !Number.isInteger(id)) {
    return NextResponse.json({ erro: 'Rota inválida.' }, { status: 404 })
  }
  try {
    const corpo = await req.json().catch(() => ({}))
    return NextResponse.json(await atualizar(e, id, corpo))
  } catch (erro) {
    return respostaDeErro(erro, statusDoErro(erro))
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { e, id } = await resolver(ctx)
  if (!e || !Number.isInteger(id)) {
    return NextResponse.json({ erro: 'Rota inválida.' }, { status: 404 })
  }
  try {
    return NextResponse.json(await excluir(e, id))
  } catch (erro) {
    return respostaDeErro(erro, statusDoErro(erro))
  }
}
