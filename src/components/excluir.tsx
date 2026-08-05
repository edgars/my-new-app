'use client'

import { useActionState } from 'react'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { excluirEntidade, type EstadoForm } from '@/server/actions/entidade'

export function BotaoExcluir({ entidade, id }: { entidade: string; id: number }) {
  const [estado, acao, pendente] = useActionState<EstadoForm, FormData>(excluirEntidade, {})

  return (
    <form
      action={acao}
      onSubmit={(ev) => {
        // Conveniência de UX. A confirmação que vale acontece no servidor —
        // esta action é alcançável por POST direto, sem passar por aqui.
        if (!confirm('Excluir este registro? A ação não pode ser desfeita.')) {
          ev.preventDefault()
        }
      }}
    >
      <input type="hidden" name="_entidade" value={entidade} />
      <input type="hidden" name="_id" value={id} />
      <Button type="submit" variant="outline" disabled={pendente}
        className="text-destructive hover:text-destructive">
        <Trash2 className="size-4" />
        {pendente ? 'Excluindo…' : 'Excluir'}
      </Button>
      {estado.erro ? <p className="mt-1 text-xs text-destructive">{estado.erro}</p> : null}
    </form>
  )
}
