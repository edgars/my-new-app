import { execSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

import { PrismaClient } from '@/generated/prisma/client'

/**
 * Banco real em arquivo, não em memória.
 *
 * SQLite em memória é conexão única: cada conexão vê um banco diferente, então
 * contenção de escrita **nunca acontece** e o teste de concorrência passaria sem
 * provar nada. Arquivo + WAL + várias conexões é o único jeito de exercitar a
 * corrida que o método exige provar.
 */
export interface BancoDeTeste {
  arquivo: string
  url: string
  /** Abre uma conexão nova — cada uma é um concorrente independente. */
  novoCliente(): PrismaClient
  destruir(): void
}

const RAIZ = path.resolve(__dirname, '..', '..')

function sqlDasMigrations(): string {
  const dir = path.join(RAIZ, 'prisma', 'migrations')
  return readdirSync(dir)
    .filter((d) => /^\d/.test(d))
    .sort()
    .map((d) => readFileSync(path.join(dir, d, 'migration.sql'), 'utf8'))
    .join('\n')
}

export function criarBancoDeTeste(): BancoDeTeste {
  const dir = mkdtempSync(path.join(tmpdir(), 'sifap-test-'))
  const arquivo = path.join(dir, 'test.db')
  const url = `file:${arquivo}`

  // Aplica o schema com a mesma migration que vai para produção — não um DDL
  // paralelo escrito à mão, que divergiria em silêncio.
  const bootstrap = new Database(arquivo)
  bootstrap.pragma('journal_mode = WAL')
  bootstrap.exec(sqlDasMigrations())
  bootstrap.close()

  const clientes: PrismaClient[] = []

  return {
    arquivo,
    url,
    novoCliente() {
      const c = new PrismaClient({
        adapter: new PrismaBetterSqlite3({
          url,
          // Baixo de propósito. better-sqlite3 é síncrono: um busy_timeout alto
          // bloqueia a thread do Node e impede o vencedor de commitar. A espera
          // tem que acontecer em JS (ver src/server/db/retry.ts), não aqui.
          timeout: 50,
        }),
      })
      clientes.push(c)
      return c
    },
    destruir() {
      for (const c of clientes) void c.$disconnect()
      rmSync(dir, { recursive: true, force: true })
    },
  }
}

export const _execSync = execSync
