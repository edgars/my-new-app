import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

import { ProvedorDeTema } from '@/components/tema'
import { cn } from '@/lib/utils'

import './globals.css'

// A variável tem que se chamar --font-sans: é o nome que o tema do shadcn
// consome. Expor --font-geist deixaria a variável vazia e a página cairia no
// serif padrão do navegador, sem erro nenhum.
const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'SIFAP',
  description: 'Sistema de programas sociais, benefícios e pagamentos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={cn('font-sans', geist.variable)} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ProvedorDeTema>{children}</ProvedorDeTema>
      </body>
    </html>
  )
}
