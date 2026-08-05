import { FormularioLogin } from './formulario'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string }>
}) {
  const { de } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-semibold tracking-[0.2em]">SIFAP</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Programas sociais
          </p>
        </div>
        <FormularioLogin de={de ?? '/'} />
      </div>
    </main>
  )
}
