import { NextResponse } from 'next/server'

import { DadosInvalidos } from '@/lib/erros'

/**
 * Tradução de erro na borda HTTP.
 *
 * Erro inesperado devolve mensagem genérica: detalhe de exceção interna vazando
 * para o cliente é informação sobre o schema e sobre o caminho de arquivos.
 */
export function respostaDeErro(erro: unknown, status: number) {
  if (erro instanceof DadosInvalidos) {
    return NextResponse.json(
      { erro: erro.message, problemas: erro.problemas },
      { status: 422 },
    )
  }
  if (status >= 500) {
    console.error('[api] erro inesperado', erro)
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 })
  }
  const mensagem = erro instanceof Error ? erro.message : 'Erro.'
  return NextResponse.json({ erro: mensagem }, { status })
}
