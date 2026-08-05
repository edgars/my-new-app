import { BarraLateral } from '@/components/barra-lateral'
import { Topo } from '@/components/topo'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { exigirUsuarioNaTela } from '@/server/auth/sessao'

// Todo segmento aqui lê sessão e banco: não pode ser pré-renderizado estático.
export const dynamic = 'force-dynamic'

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  // Fail-closed já no shell: nenhuma tela interna renderiza sem sessão.
  const usuario = await exigirUsuarioNaTela('/')

  return (
    <SidebarProvider>
      <BarraLateral usuario={usuario} />
      <SidebarInset>
        <Topo usuario={usuario} />
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
