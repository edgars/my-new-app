'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { entidadePorChave } from '@/lib/entidades'
import { DadosInvalidos } from '@/lib/erros'
import { atualizar, criar, excluir } from '@/server/crud/servico'

export interface EstadoForm {
  erro?: string
  problemas?: { campo: string | null; mensagem: string }[]
}

function dadosDoForm(form: FormData): Record<string, unknown> {
  const dados: Record<string, unknown> = {}
  for (const [k, v] of form.entries()) {
    if (k.startsWith('_')) continue
    dados[k] = typeof v === 'string' ? v : undefined
  }
  return dados
}

function traduzir(erro: unknown): EstadoForm {
  if (erro instanceof DadosInvalidos) {
    return { erro: erro.message, problemas: erro.problemas }
  }
  throw erro
}

export async function salvarEntidade(
  _estado: EstadoForm,
  form: FormData,
): Promise<EstadoForm> {
  const chave = String(form.get('_entidade') ?? '')
  const idBruto = form.get('_id')
  const e = entidadePorChave(chave)
  if (!e) return { erro: 'Entidade desconhecida.' }

  const dados = dadosDoForm(form)
  let destino: string

  try {
    if (idBruto) {
      const id = Number(idBruto)
      await atualizar(e, id, dados)
      destino = e.rota
    } else {
      await criar(e, dados)
      destino = e.rota
    }
  } catch (erro) {
    return traduzir(erro)
  }

  revalidatePath(e.rota)
  redirect(destino)
}

/**
 * Exclusão.
 *
 * A confirmação de verdade acontece no servidor: `excluir` exige sessão válida e
 * registro existente. O `confirm()` da tela é conveniência de UX — esta action é
 * alcançável por POST direto e não pode depender dele.
 */
export async function excluirEntidade(
  _estado: EstadoForm,
  form: FormData,
): Promise<EstadoForm> {
  const chave = String(form.get('_entidade') ?? '')
  const id = Number(form.get('_id'))
  const e = entidadePorChave(chave)
  if (!e || !Number.isInteger(id)) return { erro: 'Requisição inválida.' }

  try {
    await excluir(e, id)
  } catch (erro) {
    return traduzir(erro)
  }

  revalidatePath(e.rota)
  redirect(e.rota)
}
