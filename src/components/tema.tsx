'use client'

import { Moon, Sun } from 'lucide-react'
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ProvedorDeTema({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  )
}

export function AlternarTema() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Alternar tema"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {/*
        Os dois ícones são renderizados e a classe `dark` decide qual aparece.
        A alternativa usual — um flag `montado` num efeito — força um segundo
        render e pisca o ícone errado no primeiro quadro; aqui o CSS resolve
        antes da hidratação e não há divergência de marcação.
      */}
      <Moon className="size-[18px] dark:hidden" />
      <Sun className="hidden size-[18px] dark:block" />
    </Button>
  )
}
