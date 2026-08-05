import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

import { PrismaClient } from '@/generated/prisma/client'

/**
 * Cliente preguiçoso.
 *
 * Conectar na avaliação do módulo faz `next build` falhar com "Failed to collect
 * page data" — mensagem que não aponta a causa. O build tem que passar sem
 * DATABASE_URL definida; só o runtime precisa do banco.
 * Ver docs/build/03-milestones.md, armadilha #2.
 */
let instance: PrismaClient | null = null

function getClient(): PrismaClient {
  if (instance) return instance

  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')

  instance = new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url,
      // Baixo de propósito. better-sqlite3 é síncrono: um busy_timeout alto
      // bloqueia a thread do Node e impede a escrita vencedora de commitar,
      // e as duas se estorvam até estourar. A espera acontece em JS, com
      // await, em src/server/db/retry.ts — lá ela devolve o event loop.
      timeout: 50,
    }),
  })
  return instance
}

const globalForPrisma = globalThis as unknown as { sifapPrisma?: PrismaClient }

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    // Em dev o Next recarrega módulos a cada edição; sem o cache global cada
    // recarga abriria uma conexão nova até estourar o limite de handles.
    const real = globalForPrisma.sifapPrisma ?? getClient()
    if (process.env.NODE_ENV !== 'production') globalForPrisma.sifapPrisma = real

    const value = Reflect.get(real, prop, receiver)
    return typeof value === 'function' ? value.bind(real) : value
  },
})

export type Db = PrismaClient
export type Tx = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0]
