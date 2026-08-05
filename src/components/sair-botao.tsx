'use client'

import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { sair } from '@/server/actions/auth'

export function BotaoSair() {
  return (
    <form action={sair}>
      <Button type="submit" variant="outline" size="sm" className="w-full justify-center">
        <LogOut className="size-4" />
        Sair
      </Button>
    </form>
  )
}
