import { notFound } from 'next/navigation'

import { BotaoExcluir } from '@/components/excluir'
import { CabecalhoPagina } from '@/components/cabecalho-pagina'
import { FormularioEntidade } from '@/components/formulario'
import { PainelCalculo } from '@/components/painel-calculo'
import { entidadePorChave } from '@/lib/entidades'
import { NaoEncontrado } from '@/lib/erros'
import { avisosDe, obter, opcoesDePai } from '@/server/crud/servico'
import { painelDoPagamento } from '@/server/queries/pagamento'

export default async function EditarPage({
  params,
}: {
  params: Promise<{ entidade: string; id: string }>
}) {
  const { entidade, id: idBruto } = await params
  const e = entidadePorChave(entidade)
  const id = Number(idBruto)
  if (!e || !Number.isInteger(id)) notFound()

  let registro
  try {
    registro = await obter(e, id)
  } catch (erro) {
    if (erro instanceof NaoEncontrado) notFound()
    throw erro
  }

  const opcoes = e.pai ? await opcoesDePai(e) : undefined
  // O motor de cálculo (INV-17..35) só tem sentido no Pagamento.
  const painel = e.modelo === 'pagamento' ? await painelDoPagamento(id) : null

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <CabecalhoPagina
        migalhas={[
          { rotulo: 'Início', href: '/' },
          { rotulo: e.titulo, href: e.rota },
          { rotulo: `#${id}` },
        ]}
        titulo={`Editar ${e.singular}`}
        descricao={`Registro #${id}.`}
        acoes={<BotaoExcluir entidade={e.chave} id={id} />}
      />
      <FormularioEntidade
        entidade={e}
        registro={registro}
        opcoesPai={opcoes}
        avisos={avisosDe(e, registro)}
      />
      {painel ? <PainelCalculo painel={painel} /> : null}
    </div>
  )
}
