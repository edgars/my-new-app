import { AlertTriangle, Info, Scissors } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { emCentavos, formatarBRL } from '@/lib/money'
import type { PainelCalculo as Painel } from '@/server/queries/pagamento'

/**
 * Painel de cálculo do Pagamento.
 *
 * Componente puro de apresentação: recebe o resultado já calculado pelo domínio.
 * Nenhuma conta acontece aqui — nem uma soma.
 */

function brl(v: number | null | undefined) {
  return v == null ? '—' : formatarBRL(emCentavos(v))
}

/**
 * Par rótulo→valor.
 *
 * `dt`/`dd` de propósito: leitor de tela anuncia "Líquido calculado, R$ 700,00"
 * como um par. Com `div`/`span` os dois viram texto solto e a relação some.
 */
function Linha({
  rotulo,
  valor,
  forte,
  atenuado,
}: {
  rotulo: string
  valor: string
  forte?: boolean
  atenuado?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <dt className={forte ? 'font-medium' : 'text-muted-foreground'}>{rotulo}</dt>
      <dd
        className={`tabular-nums ${forte ? 'font-medium' : ''} ${atenuado ? 'text-muted-foreground' : ''}`}
      >
        {valor}
      </dd>
    </div>
  )
}

export function PainelCalculo({ painel }: { painel: Painel }) {
  const { descontos, beneficio, gravado } = painel

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-4">
        {/* <h2> real: CardTitle do shadcn é um <div> e não expõe papel de
            cabeçalho, então a navegação por seções some no leitor de tela. */}
        <h2 className="font-heading text-base leading-snug font-medium">Cálculo</h2>
        <CardDescription>
          Recalculado pelo domínio a partir dos parâmetros atuais. O que está gravado no
          registro aparece ao lado, para comparação.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 py-6">
        {/* --- composição do bruto (INV-17 a INV-25) --- */}
        {beneficio ? (
          <section>
            <h3 className="mb-2 text-sm font-medium">Composição do bruto</h3>
            <dl className="grid gap-x-8 text-sm sm:grid-cols-2">
              <Linha rotulo="Base do programa" valor={brl(beneficio.vlrBase)} />
              <Linha rotulo="Benefício (INV-17)" valor={brl(beneficio.vlrBenef)} />
              <Linha rotulo="13º salário (INV-24)" valor={brl(beneficio.vlr13)} />
              <Linha rotulo="Abono natalino 15% (INV-23)" valor={brl(beneficio.vlrAbono)} />
            </dl>
            <Separator className="my-2" />
            <dl className="text-sm">
              <Linha rotulo="Bruto calculado" valor={brl(beneficio.vlrBruto)} forte />
            </dl>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="secondary">idade {beneficio.fatorIdade}</Badge>
              <Badge variant="secondary">RND {beneficio.fatorRnd}</Badge>
              <Badge variant="secondary">faixa {beneficio.fatorFaixa}</Badge>
              <Badge variant="secondary">regional {beneficio.fatorRegional}</Badge>
              {beneficio.idade != null ? (
                <Badge variant="outline">{beneficio.idade} anos na competência</Badge>
              ) : null}
            </div>
          </section>
        ) : (
          <Alert>
            <Info />
            <AlertTitle>Benefício não recalculado</AlertTitle>
            <AlertDescription>
              Programa ou beneficiário não localizado pelos códigos gravados. O legado liga
              os três por código, não por chave estrangeira.
            </AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* --- descontos (INV-26 a INV-33) --- */}
        <section>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-sm font-medium">Descontos</h3>
            <p className="text-xs text-muted-foreground">
              Teto de 30% do bruto (INV-32): {brl(descontos.tetoDesconto)}
            </p>
          </div>

          {descontos.itens.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum desconto lançado.</p>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Calculado</TableHead>
                    <TableHead className="text-right">Aplicado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {descontos.itens.map((i, idx) => (
                    <TableRow key={`${i.tipo}-${idx}`}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          {i.rotulo}
                          {i.cortadoPeloTeto ? (
                            <Badge
                              variant="outline"
                              className="gap-1 border-amber-500/40 text-amber-600 dark:text-amber-400"
                            >
                              <Scissors className="size-3" />
                              cortado pelo teto
                            </Badge>
                          ) : null}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {brl(i.valorOriginal)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {brl(i.valorAplicado)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-medium hover:bg-transparent">
                    <TableCell>Total</TableCell>
                    <TableCell />
                    <TableCell className="text-right tabular-nums">
                      {brl(descontos.vlrDescontoTotal)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {descontos.tetoAcionado ? (
            <Alert className="mt-3 border-amber-500/40 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-600">
              <AlertTriangle />
              <AlertTitle>Teto de 30% acionado</AlertTitle>
              <AlertDescription>
                A ordem de corte adotada preserva pensão alimentícia, imposto retido e
                contribuição social, e corta antes administrativo, sindical e judicial —{' '}
                <strong>essa ordem não vem da fonte</strong>. Ponto a confirmar nº 2, impacto
                alto.
              </AlertDescription>
            </Alert>
          ) : null}

          {descontos.tetoImpossivel ? (
            <Alert variant="destructive" className="mt-3">
              <AlertTriangle />
              <AlertTitle>Teto não pôde ser respeitado</AlertTitle>
              <AlertDescription>
                Mesmo cortando tudo o que é cortável, o total ainda passa do teto. Há
                desconto de tipo desconhecido lançado.
              </AlertDescription>
            </Alert>
          ) : null}
        </section>

        <Separator />

        {/* --- líquido e conciliação --- */}
        <dl className="grid gap-x-8 text-sm sm:grid-cols-2">
          <Linha
            rotulo="Líquido calculado (INV-33)"
            valor={brl(descontos.vlrLiquido)}
            forte
          />
          <Linha rotulo="Líquido gravado" valor={brl(gravado.vlrLiquido)} atenuado />
          {gravado.vlrConciliado != null ? (
            <>
              <Linha rotulo="Conciliado pelo banco" valor={brl(gravado.vlrConciliado)} />
              <Linha
                rotulo="Diferença (INV-35)"
                valor={brl(painel.diferencaConciliacao)}
                atenuado={!painel.diferencaConciliacao}
              />
            </>
          ) : null}
        </dl>

        {/* --- divergência entre gravado e recalculado --- */}
        {painel.divergencias.length > 0 ? (
          <Alert className="border-amber-500/40 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-600">
            <AlertTriangle />
            <AlertTitle>O valor gravado difere do recalculado</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4">
                {painel.divergencias.map((d) => (
                  <li key={d.campo}>
                    {d.campo}: gravado {brl(d.gravado)} · calculado {brl(d.calculado)}
                  </li>
                ))}
              </ul>
              <p className="mt-1">
                Esperado enquanto os pontos a confirmar de impacto alto estiverem abertos —
                os fatores de idade e RND estão neutros por falta de dado na fonte.
              </p>
            </AlertDescription>
          </Alert>
        ) : null}

        {/* --- honestidade de proveniência, na própria tela --- */}
        {painel.presumidos.length > 0 ? (
          <details className="rounded-md border px-4 py-3 text-sm">
            <summary className="cursor-pointer text-muted-foreground">
              {painel.presumidos.length} leitura(s) adotada(s) neste cálculo
            </summary>
            <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
              {painel.presumidos.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </details>
        ) : null}
      </CardContent>
    </Card>
  )
}
