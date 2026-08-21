# SIFAP

Sistema de cadastro de beneficiários, programas sociais e pagamentos, derivado de
um legado NATURAL/mainframe pelo caminho RNC → UIR → BMAD. A fonte da verdade é
`docs/`; a leitura que originou o código está em `docs/build/`.

Stack: Next.js 16 (App Router) · React 19 · Prisma 7 · SQLite (better-sqlite3) ·
Tailwind 4 · Vitest · Playwright.

---

## Rodar no GitHub Codespaces

1. No GitHub: **Code → Codespaces → Create codespace on main**.
2. Espere o `postCreateCommand` terminar (`.devcontainer/setup.sh`). Ele instala as
   dependências, gera o Prisma Client, cria o banco e popula os dados de exemplo.
3. No terminal do Codespace:

   ```bash
   npm run dev
   ```

4. Abra a porta **3000** encaminhada (aba *Ports*) e entre com um dos
   [usuários iniciais](#usuários-iniciais).

Se quiser refazer o setup a qualquer momento, ele é idempotente:

```bash
bash .devcontainer/setup.sh
```

## Rodar localmente

Precisa de **Node.js ≥ 20.12** (o devcontainer usa 22).

```bash
cp .env.example .env      # Windows/PowerShell: veja o aviso de encoding abaixo
npm ci                    # ou: npm install
npx prisma generate       # gera src/generated/ — é gitignored, não pule
npx prisma migrate deploy # cria prisma/dev.db e aplica as migrations
npm run db:seed           # dados de exemplo + usuários iniciais
npm run dev               # http://localhost:3000
```

## Usuários iniciais

Criados por `prisma/seed.ts`. São credenciais de **desenvolvimento** — não
promova nenhuma delas para um ambiente real.

| Login      | Senha      | Nome                 | Perfil  | Lotação  |
| ---------- | ---------- | -------------------- | ------- | -------- |
| `admin`    | `admin123` | Administrador        | `ADMIN` | `SEDE`   |
| `operador` | `oper123`  | Operador de Cadastro | `OPER`  | `REG-NE` |

Dois detalhes que importam:

- **A tabela de usuário é `NOVO`** — não veio do legado. O NATURAL não expôs
  autenticação no material extraído, mas gravava `usrInclusao`,
  `usrUltAlteracao`, `usrEvento`, `codPerfil` e `codLotacao`: havia usuário
  identificado. Um CRUD de CPF, renda familiar, biometria e conta bancária sem
  auth é inaceitável no rigor "produção". A decisão está em
  `docs/build/02-divergences.md` → **S-05**.
- **`codPerfil` ainda não autoriza nada.** A autenticação é *fail-closed*
  (autenticado × anônimo), mas não há checagem de perfil em lugar nenhum do
  `src/`: hoje `admin` e `operador` têm exatamente os mesmos poderes. O perfil é
  exibido na barra lateral e gravado na auditoria. Autorização por perfil é
  trabalho em aberto.

Rodar `npm run db:seed` de novo apaga e recria os dados de exemplo.

## Comandos

| Comando                     | O que faz                                             |
| --------------------------- | ----------------------------------------------------- |
| `npm run dev`               | Servidor de desenvolvimento na porta 3000             |
| `npm test`                  | Domínio + concorrência (Vitest) — sem UI e sem HTTP    |
| `npm run typecheck`         | `tsc --noEmit`                                        |
| `npm run lint`              | ESLint                                                |
| `npm run build`             | `prisma generate && next build` — passa sem `DATABASE_URL` |
| `npm start`                 | Servidor de produção (exige `npm run build` antes)    |
| `npm run db:migrate`        | `prisma migrate deploy`                               |
| `npm run db:seed`           | Recria os dados de exemplo                            |
| `npm run test:e2e`          | Playwright (precisa de `npx playwright install`)      |

O `CLAUDE.md` documenta os mesmos comandos com `pnpm`; os dois lockfiles estão no
repositório. O caminho suportado no Codespaces é o **npm** — é o que
`.devcontainer/setup.sh` usa.

## Armadilhas conhecidas

**`DATABASE_URL is not set`** — falta o `.env`, ou ele existe mas está num
encoding que o dotenv não lê. No PowerShell 5.1, `> .env` e `Out-File` gravam
**UTF-16LE**; o Next lê como UTF-8, a chave vira lixo e nunca casa com
`DATABASE_URL`. Grave em UTF-8 (`Out-File -Encoding utf8`, ou use o editor).

**`Could not locate the bindings file`** (better-sqlite3) — o binário nativo não
foi compilado. O npm 12 bloqueia install scripts por padrão; o repositório já
libera o necessário via `"allowScripts"` no `package.json`. Se ainda assim
faltar:

```bash
npm install-scripts approve better-sqlite3
npm rebuild better-sqlite3
```

**Escrita concorrente em SQLite** — `better-sqlite3` é síncrono e trava a thread.
Leia `docs/build/04-pitfalls-next-prisma-sqlite.md` antes de mexer em transação.
Regra prática: não leia antes de escrever; use statement atômico e deixe a
decisão com o banco.

## Estrutura

```
src/
├── app/          rotas e telas
├── components/   UI — nunca fala com o banco (imposto por lint)
├── lib/          dinheiro (centavos), datas YYYYMMDD, schemas
└── server/
    ├── db/       cliente Prisma preguiçoso + retry de contenção
    ├── queries/  leitura
    ├── actions/  valida, transaciona, traduz erro, revalida
    └── domain/   regra de negócio — pura ou sobre o banco
```

Dinheiro é `Float` no banco por fidelidade ao legado (`docs/architecture.md`
S-01), mas **toda aritmética acontece em centavos inteiros** em
`src/lib/money.ts`. Datas são `Float` no formato `YYYYMMDD` — é o número do
mainframe (S-04), e `INV-15` depende literalmente disso.

As regras completas de trabalho neste repositório estão em `CLAUDE.md`.

---

_Derivado de um legado por RNC. Formato do plano: método BMAD
(https://github.com/bmad-code-org)._
