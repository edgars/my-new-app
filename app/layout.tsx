import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/app-shell'

export const metadata: Metadata = {
  title: 'RNC Generated App',
  description: 'Modernized from a legacy system by RNC.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
