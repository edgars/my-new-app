'use client'

import { useActionState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { entrar, type EstadoLogin } from '@/server/actions/auth'

export function FormularioLogin({ de }: { de: string }) {
  const [estado, acao, pendente] = useActionState<EstadoLogin, FormData>(entrar, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Informe suas credenciais para continuar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={acao} className="flex flex-col gap-4">
          <input type="hidden" name="de" value={de} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="login">Login</Label>
            <Input id="login" name="login" autoComplete="username" required autoFocus />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {estado.erro ? (
            <Alert variant="destructive">
              <AlertTriangle />
              <AlertTitle>{estado.erro}</AlertTitle>
            </Alert>
          ) : null}

          <Button type="submit" disabled={pendente} className="w-full">
            {pendente ? <Loader2 className="size-4 animate-spin" /> : null}
            {pendente ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
