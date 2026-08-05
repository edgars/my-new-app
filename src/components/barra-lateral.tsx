'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAVEGACAO } from '@/lib/navegacao'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { BotaoSair } from './sair-botao'

export function BarraLateral({ usuario }: { usuario: { nome: string; codPerfil: string } }) {
  const caminho = usePathname()

  const ativo = (href: string) =>
    href === '/' ? caminho === '/' : caminho.startsWith(href)

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b px-4 py-5">
        <Link href="/" className="flex flex-col gap-0.5">
          <span className="text-lg font-semibold tracking-[0.2em]">SIFAP</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Programas sociais
          </span>
        </Link>
      </SidebarHeader>

      {/*
        <nav> explícito: o Sidebar do shadcn é um <div> e não cria landmark.
        Sem ele, quem usa leitor de tela não tem como pular para a navegação.
      */}
      <SidebarContent>
        <nav aria-label="Navegação principal" className="contents">
        {NAVEGACAO.map((grupo) => (
          <SidebarGroup key={grupo.titulo}>
            <SidebarGroupLabel>{grupo.titulo}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {grupo.itens.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    {/* Base UI usa `render`, não `asChild`. */}
                    <SidebarMenuButton
                      isActive={ativo(item.href)}
                      render={
                        // aria-current é o que leitor de tela anuncia como
                        // "página atual"; data-active só serve para o estilo.
                        <Link
                          href={item.href}
                          aria-current={ativo(item.href) ? 'page' : undefined}
                        />
                      }
                    >
                      <item.icone />
                      <span>{item.titulo}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        </nav>
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t p-4">
        <div className="min-w-0 px-1">
          <p className="truncate text-sm leading-tight font-medium">{usuario.nome}</p>
          <p className="truncate text-xs leading-tight text-muted-foreground">
            {usuario.codPerfil}
          </p>
        </div>
        <BotaoSair />
      </SidebarFooter>
    </Sidebar>
  )
}
