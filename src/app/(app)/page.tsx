import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { NAVEGACAO } from '@/lib/navegacao'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { exigirUsuarioNaTela } from '@/server/auth/sessao'
import { contagens } from '@/server/queries/painel'

export default async function Inicio() {
  const usuario = await exigirUsuarioNaTela('/')
  const totais = await contagens()

  const modulos = NAVEGACAO.filter((g) => g.titulo !== 'Visão geral')

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {usuario.nome.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Programas sociais, beneficiários e pagamentos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {totais.map((t) => (
          <Card key={t.rota}>
            <CardHeader className="pb-2">
              <CardDescription>{t.titulo}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{t.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={t.rota}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                Ver todos <ArrowRight className="size-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {modulos.map((grupo) => (
          <Card key={grupo.titulo}>
            <CardHeader>
              <CardTitle className="text-base">{grupo.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {grupo.itens.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <item.icone className="size-4 text-muted-foreground" />
                  <span className="flex-1">{item.titulo}</span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pontos a confirmar</CardTitle>
          <CardDescription>
            Regras que a fonte legada não preservou. Enquanto estiverem abertas, o cálculo
            do benefício não reproduz o sistema original.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {[
            'Valores e transições das máquinas de estado',
            'Ordem de corte quando o teto de 30% é estourado',
            'Curva idade → FATOR-IDADE',
            'Origem de FATOR-RND',
          ].map((p) => (
            <div key={p} className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 border-amber-500/40 text-amber-600 dark:text-amber-400">
                impacto alto
              </Badge>
              <span className="text-muted-foreground">{p}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
