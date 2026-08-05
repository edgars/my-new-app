'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { Campo } from '@/components/campo'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EntidadeSpec } from '@/lib/entidades'
import { salvarEntidade, type EstadoForm } from '@/server/actions/entidade'

export function FormularioEntidade({
  entidade,
  registro,
  opcoesPai,
  avisos = [],
}: {
  entidade: EntidadeSpec
  registro?: Record<string, unknown> | null
  opcoesPai?: { id: number; rotulo: string }[]
  avisos?: string[]
}) {
  const [estado, acao, pendente] = useActionState<EstadoForm, FormData>(salvarEntidade, {})
  const id = registro?.id as number | undefined

  const erroDe = (campo: string) =>
    estado.problemas?.find((p) => p.campo === campo)?.mensagem
  const geral = estado.problemas?.filter((p) => !p.campo) ?? []

  return (
    <form action={acao} className="space-y-6">
      <input type="hidden" name="_entidade" value={entidade.chave} />
      {id ? <input type="hidden" name="_id" value={id} /> : null}
      {/* Trava otimista: a versão lida vai junto e o UPDATE só casa se ela não mudou. */}
      {registro?.numVersao != null ? (
        <input type="hidden" name="numVersao" value={String(registro.numVersao)} />
      ) : null}

      {estado.erro || geral.length > 0 ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>{estado.erro ?? 'Não foi possível salvar.'}</AlertTitle>
          {geral.length > 0 ? (
            <AlertDescription>
              <ul className="list-disc pl-4">
                {geral.map((p, i) => (
                  <li key={i}>{p.mensagem}</li>
                ))}
              </ul>
            </AlertDescription>
          ) : null}
        </Alert>
      ) : null}

      {avisos.length > 0 ? (
        <Alert className="border-amber-500/40 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-600">
          <AlertTriangle />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {avisos.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card className="gap-0 py-0">
        {entidade.pai && opcoesPai ? (
          <>
            <CardHeader className="border-b py-4">
              <h2 className="font-heading text-base leading-snug font-medium">Vínculo</h2>
            </CardHeader>
            <CardContent className="py-6">
              <div className="flex max-w-md flex-col gap-2">
                <Label htmlFor="campo-pai">{entidade.pai.rotulo}</Label>
                <Select
                  name={entidade.pai.campo}
                  defaultValue={String(registro?.[entidade.pai.campo] ?? '')}
                >
                  <SelectTrigger id="campo-pai" className="w-full">
                    <SelectValue placeholder="— sem vínculo —" />
                  </SelectTrigger>
                  <SelectContent>
                    {opcoesPai.map((o) => (
                      <SelectItem key={o.id} value={String(o.id)}>
                        {o.rotulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Vínculo com o registro pai — acrescentado nesta build (S-02). O legado
                  guardava estes registros como grupo repetitivo, sem chave própria.
                </p>
              </div>
            </CardContent>
          </>
        ) : null}

        <CardHeader className="border-b py-4">
          <h2 className="font-heading text-base leading-snug font-medium">Dados</h2>
        </CardHeader>

        <CardContent className="py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {entidade.campos.map((campo) => (
              <Campo
                key={campo.nome}
                campo={campo}
                valor={registro?.[campo.nome]}
                erro={erroDe(campo.nome)}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-3 border-t py-4">
          <Link href={entidade.rota} className={buttonVariants({ variant: 'ghost' })}>
            Cancelar
          </Link>
          <Button type="submit" disabled={pendente}>
            {pendente ? <Loader2 className="size-4 animate-spin" /> : null}
            {pendente ? 'Salvando…' : 'Salvar'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
