'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

import { NAVEGACAO } from '@/lib/navegacao'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export function BuscaGlobal() {
  const [aberto, setAberto] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const atalho = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setAberto((v) => !v)
      }
    }
    document.addEventListener('keydown', atalho)
    return () => document.removeEventListener('keydown', atalho)
  }, [])

  const ir = (href: string) => {
    setAberto(false)
    router.push(href)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Busca global"
        aria-keyshortcuts="Meta+K Control+K"
        className="flex h-9 w-full max-w-md items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/50"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Buscar…</span>
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={aberto} onOpenChange={setAberto} title="Buscar" description="Ir para uma tela">
        {/*
          O <Command> tem que estar aqui: o CommandDialog do shadcn joga os
          filhos direto no DialogContent, sem o root do cmdk. Sem esse provider
          o store fica undefined e o CommandInput estoura em `.subscribe`.
        */}
        <Command>
          <CommandInput placeholder="Ir para…" />
          <CommandList>
            <CommandEmpty>Nada encontrado.</CommandEmpty>
            {NAVEGACAO.map((grupo) => (
              <CommandGroup key={grupo.titulo} heading={grupo.titulo}>
                {grupo.itens.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={`${grupo.titulo} ${item.titulo}`}
                    onSelect={() => ir(item.href)}
                  >
                    <item.icone className="size-4" />
                    {item.titulo}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
