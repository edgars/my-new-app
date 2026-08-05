import Link from 'next/link'
import { Fragment } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export interface Migalha {
  rotulo: string
  href?: string
}

export function CabecalhoPagina({
  migalhas,
  titulo,
  descricao,
  acoes,
}: {
  migalhas: Migalha[]
  titulo: string
  descricao?: string
  acoes?: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <Breadcrumb>
        <BreadcrumbList>
          {migalhas.map((m, i) => {
            const ultima = i === migalhas.length - 1
            return (
              // O separador é irmão do item, nunca filho: ambos são <li>, e
              // <li> dentro de <li> é HTML inválido. O navegador reestrutura a
              // marcação no cliente e a hidratação quebra — sintoma que aparece
              // como "Hydration failed", sem apontar a causa.
              <Fragment key={`${m.rotulo}-${i}`}>
                <BreadcrumbItem>
                  {ultima || !m.href ? (
                    <BreadcrumbPage>{m.rotulo}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={m.href} />}>
                      {m.rotulo}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {ultima ? null : <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{titulo}</h1>
          {descricao ? (
            <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>
          ) : null}
        </div>
        {acoes ? <div className="flex items-center gap-2">{acoes}</div> : null}
      </div>
    </div>
  )
}
