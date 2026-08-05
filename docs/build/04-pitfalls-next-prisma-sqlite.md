# Armadilhas — Next.js 16 + Prisma 7 + SQLite

Cada uma custou tempo real nesta build. As três primeiras não estão em nenhuma
lista de armadilhas de Next + Drizzle, porque são específicas desta combinação.

---

## 1. `datasource.url` não existe mais no schema (Prisma 7)

```
error: The datasource property `url` is no longer supported in schema files.
Error code: P1012
```

O `url` saiu do `schema.prisma` e foi para `prisma.config.ts`. O `PrismaClient`
passa a exigir um **driver adapter** — para SQLite, `@prisma/adapter-better-sqlite3`.

```ts
// prisma.config.ts
export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: { url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db' },
  migrations: { path: path.join('prisma', 'migrations'), seed: 'tsx prisma/seed.ts' },
})
```

```prisma
datasource db {
  provider = "sqlite"   // e mais nada
}
```

---

## 2. **A pior desta lista** — transação interativa do Prisma trava o SQLite

Sintoma: `Operation has timed out`, sem apontar a causa. Some quando você roda um
teste de cada vez, o que faz parecer flakiness.

```ts
// ISTO TRAVA sob concorrência
await db.$transaction(async (tx) => {
  const existe = await tx.beneficiario.findUnique({ where: { numCpf } })
  if (existe) throw new Conflito()
  return tx.beneficiario.create({ data })
})
```

O Prisma abre a transação como `DEFERRED`. Cada conexão concorrente adquire um
snapshot de leitura e depois tenta subir para escrita — o deadlock clássico de
upgrade do SQLite. Ninguém sobe, todo mundo espera.

**Correção: pare de ler antes de escrever.** Um statement atômico, e a decisão
fica com o banco:

```ts
// inclusão — o UNIQUE decide quem ganhou
try {
  return await db.beneficiario.create({ data })
} catch (e) {
  if (ehErroDeUnicidade(e)) return conflito()
  throw e
}

// alteração — trava otimista, count = 0 significa que perdeu
const r = await db.beneficiario.updateMany({
  where: { id, numVersao },
  data: { ...dados, numVersao: { increment: 1 } },
})
```

Sem janela entre checar e agir, porque não há checagem separada.

---

## 3. `busy_timeout` alto **piora** a contenção com `better-sqlite3`

Contraintuitivo o bastante para custar uma rodada inteira de depuração.

`better-sqlite3` é **síncrono**. A escrita perdedora entra no `busy_timeout` e
bloqueia a thread do Node inteira — impedindo a vencedora de commitar e liberar a
trava. Quanto maior o timeout, mais tempo as duas se estorvam.

Saída real do diagnóstico, com `timeout: 2000` e duas conexões:

```
updates concorrentes: [
  {"status":"fulfilled","value":{"count":1}},
  {"status":"rejected","reason":{"code":"P1008",
    "originalCode":"SQLITE_BUSY","originalMessage":"database is locked"}}
]
```

**Correção: inverter onde a espera acontece.** `timeout` baixo (50 ms) para falhar
rápido, e o retry em JavaScript com `await` — que devolve o event loop e deixa a
vencedora concluir. Ver `src/server/db/retry.ts`.

```ts
new PrismaBetterSqlite3({ url, timeout: 50 })
```

---

## 4. `eslint-config-next` 16 quebra dentro de `FlatCompat`

```
TypeError: Converting circular structure to JSON
```

A versão 16 já exporta flat config. Usar `FlatCompat` sobre ela estoura ao
serializar. Importe direto:

```js
import next from 'eslint-config-next'
export default [{ ignores: [...] }, ...next, /* suas regras */]
```

---

## 5. `eslint .` varre `.claude/` e `_bmad/`

Ferramental do repositório entra na varredura e falha com regras que nem estão
instaladas (`n/no-unsupported-features/node-builtins`). Adicione aos `ignores`.

---

## 6. TypeScript 7 e ESLint 10 são novos demais para o ecossistema Next 16

`pnpm add -D typescript eslint` traz as últimas e produz uma cascata de
`unmet peer`. Fixe `typescript@5` e `eslint@9`.

---

## 7. `better-sqlite3` precisa ser dependência direta

Com pnpm (`node_modules` estrito), importar `better-sqlite3` no harness de teste
falha mesmo com o adapter instalado — ele é transitivo, não direto.

```
Error: Cannot find package 'better-sqlite3'
```

Instale explicitamente. E declare os dois em `serverExternalPackages` no
`next.config.ts`, senão o binding nativo entra no bundle do servidor.

---

## 8. Banco de teste em memória não prova nada sobre concorrência

SQLite em memória dá **um banco por conexão**. O teste de corrida passa sem nunca
ter havido contenção.

Use arquivo temporário + WAL + uma conexão por concorrente, e aplique o schema com
a **mesma** migration que vai para produção — não um DDL paralelo, que divergiria
em silêncio. Ver `tests/setup/db.ts`.

---

## 9. Herdadas de Next + Drizzle, e que valem igual aqui

| Armadilha | Prevenção adotada |
|---|---|
| Build exige `DATABASE_URL` | Cliente Prisma preguiçoso atrás de `Proxy` (`src/server/db/client.ts`) |
| `next build` pré-renderiza página que lê do banco | `export const dynamic = 'force-dynamic'` no layout do segmento |
| `server-only` quebra o Vitest | alias para stub em `vitest.config.ts` |
| Variável de fonte com nome errado | `Inter({ variable: '--font-sans' })`, que é o nome que o tema consome |
| Zod 4 recusa `.pipe()` após `z.coerce` | `z.preprocess` |
