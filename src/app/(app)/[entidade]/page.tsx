import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Plus, Search } from 'lucide-react'

import { CabecalhoPagina } from '@/components/cabecalho-pagina'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { colunasDaLista, entidadePorChave } from '@/lib/entidades'
import { paraExibicao } from '@/lib/formatar'
import { schemaDeBusca } from '@/lib/schemas'
import { listar } from '@/server/crud/servico'

export default async function ListaPage({
  params,
  searchParams,
}: {
  params: Promise<{ entidade: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { entidade } = await params
  const e = entidadePorChave(entidade)
  if (!e) notFound()

  // A sessão já foi exigida no layout do grupo (app); `listar` exige de novo,
  // porque o serviço é a autoridade e não confia na camada de cima.
  const sp = await searchParams
  const busca = schemaDeBusca.parse({
    q: sp.q,
    pagina: sp.pagina ?? 1,
    tamanho: sp.tamanho ?? 20,
  })
  const pagina = await listar(e, busca)
  const colunas = colunasDaLista(e)

  const paginaHref = (n: number) =>
    `${e.rota}?pagina=${n}${busca.q ? `&q=${encodeURIComponent(busca.q)}` : ''}`

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <CabecalhoPagina
        migalhas={[{ rotulo: 'Início', href: '/' }, { rotulo: e.titulo }]}
        titulo={e.titulo}
        descricao={`${pagina.total} registro(s) cadastrado(s).`}
        acoes={
          <Link href={`${e.rota}/new`} className={buttonVariants()}>
            <Plus className="size-4" />
            Novo
          </Link>
        }
      />

      <Card className="gap-0 overflow-hidden py-0">
        <div className="border-b p-4">
          <form action={e.rota} className="flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={busca.q ?? ''}
                placeholder={`Buscar por ${e.busca.join(', ') || 'termo'}…`}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline">
              Buscar
            </Button>
          </form>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {colunas.map((c) => (
                    <TableHead key={c.nome} className="whitespace-nowrap">
                      {c.rotulo}
                    </TableHead>
                  ))}
                  <TableHead className="w-px" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagina.itens.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={colunas.length + 1}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Nenhum registro.
                    </TableCell>
                  </TableRow>
                ) : (
                  pagina.itens.map((item) => (
                    <TableRow key={String(item.id)}>
                      {colunas.map((c) => (
                        <TableCell
                          key={c.nome}
                          className={
                            c.componente === 'moeda' || c.componente === 'percentual'
                              ? 'whitespace-nowrap tabular-nums'
                              : 'whitespace-nowrap'
                          }
                        >
                          {paraExibicao(c, item[c.nome])}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <Link
                          href={`${e.rota}/${item.id}/edit`}
                          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                        >
                          Editar
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {pagina.paginas > 1 ? (
          <CardFooter className="justify-between border-t py-3">
            <p className="text-sm text-muted-foreground">
              Página {pagina.pagina} de {pagina.paginas}
            </p>
            <div className="flex gap-2">
              {busca.pagina > 1 ? (
                <Link
                  href={paginaHref(busca.pagina - 1)}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Anterior
                </Link>
              ) : null}
              {busca.pagina < pagina.paginas ? (
                <Link
                  href={paginaHref(busca.pagina + 1)}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  Próxima
                </Link>
              ) : null}
            </div>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}
