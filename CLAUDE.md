# SIFAP — regras de trabalho

Aplicação derivada de um legado NATURAL/mainframe por RNC → UIR → BMAD. A fonte é
`docs/`; a leitura dela está em `docs/build/`.

## Proveniência — não negociável

- Toda regra de negócio cita a origem no comentário: `FR-NN` (condição literal em
  `docs/prd.md`), rótulo de `docs/epics/`, ou o artefato de onde veio
- Inferência é marcada `[PRESUMIDO]` no código e listada em
  `docs/build/01-invariants.md` → "pontos a confirmar"
- O que não existe na fonte é marcado `NOVO` e justificado
- Nunca afirmar que algo funciona sem ter executado — dizer qual comando provou
- Ao encontrar defeito em trabalho anterior: corrigir e reportar explicitamente

## Arquitetura — A1, monólito em camadas

```
src/
├── app/          rotas e telas
├── components/   UI — nunca fala com o banco (imposto por lint)
├── lib/          dinheiro (centavos), datas YYYYMMDD, schemas
└── server/
    ├── db/       cliente Prisma preguiçoso + retry de contenção
    ├── queries/  leitura
    ├── actions/  valida, transaciona, traduz erro, revalida
    └── domain/   REGRA DE NEGÓCIO — puro ou sobre o banco
```

- Regra de negócio **nunca** mora em componente. `no-restricted-imports` bloqueia
  o import do banco fora de `src/server/`
- Ação destrutiva confirma **no servidor**, não só no diálogo — Server Actions são
  alcançáveis por POST direto
- Teste de domínio roda sem UI, sem HTTP e sem framework

## Dinheiro

Colunas são `Float` por fidelidade a `docs/architecture.md` (S-01). **Toda
aritmética acontece em centavos inteiros** em `src/lib/money.ts`; só o resultado
já truncado volta para `Float`.

`truncar2` e `arredondar2` são funções **diferentes** de propósito: o legado
documenta que um caminho arredonda enquanto os outros truncam (INV-36).
Não unifique.

## Datas

`Float` no formato `YYYYMMDD` / `HHMMSS` — é o número do mainframe (S-04).
`INV-15` depende literalmente disso. Conversão só na borda, em `src/lib/dates.ts`.

## SQLite — o que morde

`better-sqlite3` é síncrono. Escrita concorrente no mesmo processo trava a thread.
Ver `docs/build/04-pitfalls-next-prisma-sqlite.md` antes de mexer em transação.

Regra prática: **não leia antes de escrever**. Use statement atômico e deixe a
decisão com o banco (UNIQUE, ou `WHERE ... AND numVersao = ?`).

## Comandos

```bash
pnpm test          # domínio + concorrência
pnpm typecheck
pnpm lint
pnpm build         # tem que passar SEM DATABASE_URL
pnpm db:migrate && pnpm db:seed
pnpm dev
```

Os mesmos scripts existem em `npm run <script>`. O Codespaces usa **npm** —
`.devcontainer/setup.sh` é o caminho verificado. Os dois lockfiles estão
versionados; não misture os dois gerenciadores no mesmo `node_modules`.

Setup do zero (qualquer ambiente): `.env` a partir de `.env.example` →
`prisma generate` (gera `src/generated/`, que é gitignored) → `migrate deploy` →
`db:seed`. Pular o `generate` quebra todo import de `@/generated/prisma/client`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
