import { AlternarTema } from '@/components/tema'
import { BuscaGlobal } from '@/components/busca-global'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

function iniciais(nome: string) {
  return nome
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function Topo({ usuario }: { usuario: { nome: string; login: string } }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <BuscaGlobal />
      <div className="ml-auto flex items-center gap-1">
        <AlternarTema />
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">{iniciais(usuario.nome)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
