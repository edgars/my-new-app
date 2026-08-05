import { notFound } from 'next/navigation'

import { CabecalhoPagina } from '@/components/cabecalho-pagina'
import { FormularioEntidade } from '@/components/formulario'
import { entidadePorChave } from '@/lib/entidades'
import { opcoesDePai } from '@/server/crud/servico'

export default async function NovoPage({
  params,
}: {
  params: Promise<{ entidade: string }>
}) {
  const { entidade } = await params
  const e = entidadePorChave(entidade)
  if (!e) notFound()

  const opcoes = e.pai ? await opcoesDePai(e) : undefined
  const obrigatorios = e.campos.filter((c) => c.obrigatorio).length

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <CabecalhoPagina
        migalhas={[
          { rotulo: 'Início', href: '/' },
          { rotulo: e.titulo, href: e.rota },
          { rotulo: 'Novo' },
        ]}
        titulo={`Novo ${e.singular}`}
        descricao={
          obrigatorios > 0
            ? `Preencha os dados. Campos marcados com * são obrigatórios (${obrigatorios}).`
            : 'Preencha os dados do registro.'
        }
      />
      <FormularioEntidade entidade={e} opcoesPai={opcoes} />
    </div>
  )
}
