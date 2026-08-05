# Plano de marcos — SIFAP

Rigor: **produção**. Arquitetura: **A1 — monólito em camadas**.
Princípio: domínio antes de UI, teste antes de tela.

Cada marco fecha com o ritual de verificação executado e a auditoria de proveniência
entregue. Nenhum marco é declarado pronto sem comando executado que o prove.

---

## M0 — Fundação

Scaffold Next.js + TypeScript + Tailwind + shadcn/ui, Prisma + SQLite, Vitest, Playwright,
Zod. `CLAUDE.md` com as regras de proveniência. `.nvmrc` + `engines`.

**Aceite:** `pnpm typecheck && pnpm lint && pnpm build` passa **sem `DATABASE_URL`**
definida. Cliente Prisma preguiçoso — build que exige banco é armadilha de CI.

## M1 — Schema + domínio + testes, **sem nenhuma UI**

O marco que decide a qualidade de todo o resto.

- `prisma/schema.prisma`: 8 modelos, `UNIQUE` de D-04, FKs anuláveis de S-02
- `src/lib/money.ts` — centavos inteiros, `truncar2` e `arredondar2` distintos (INV-21 × INV-36)
- `src/lib/dates.ts` — `YYYYMMDD` ⇄ `Date`
- `src/server/domain/cpf.ts` — INV-11..14
- `src/server/domain/idade.ts` — INV-09, INV-15, INV-16
- `src/server/domain/beneficio.ts` — INV-17..25
- `src/server/domain/descontos.ts` — INV-26..33
- `src/server/domain/conciliacao.ts` — INV-34..36
- `src/server/domain/status.ts` — INV-37..39
- `src/server/domain/beneficiario.ts` — INV-01..08, INV-10 (recebe `tx`)

**Aceite:**
- Um arquivo de teste por invariante; 39 invariantes cobertos
- CPF validado contra casos reais conhecidos, **incluindo** os que passariam num mod-11
  ingênuo (`000.000.000-00` e repetidos)
- Truncar × arredondar provados divergentes no mesmo valor de entrada (INV-36)
- **Teste de concorrência:** N inserções paralelas do mesmo CPF ⇒ exatamente 1 sucesso.
  SQLite não tem `SELECT FOR UPDATE`; a prova usa arquivo real em WAL com múltiplas
  conexões + `BEGIN IMMEDIATE` + trava otimista por `numVersao`.
  Banco em memória é conexão única e **não** exercita contenção — não serve aqui.
- `pnpm test` verde **sem nenhuma tela existir**

## M2 — Auth fail-closed + trilha de auditoria

Auth negando por padrão (S-05). `usrInclusao` / `usrUltAlteracao` preenchidos pelo
servidor, nunca pelo formulário. Escrita em `Auditoria` a partir do servidor.

**Aceite:** `POST` direto sem sessão devolve 401/403 em toda mutação — provado por `curl`,
não por inspeção de código. Ação destrutiva confirma **no servidor**.

## M3 — Contexto Programa Social (UI)

`ProgramaSocial`, `ProgramaSocialGrpFaixaCalculo`, `ProgramaSocialGrpParamRegional`.
Rotas de `EXPERIENCE.md`, campos e ordem de `DESIGN.md`, listagem curada por D-03.

**Aceite:** ritual de verificação completo, inclusive a comparação
**valor renderizado × consulta direta ao banco**.

## M4 — Contexto Beneficiário (UI)

`Beneficiario`, `BeneficiarioGrpDependente`. Validações INV-01..10 ligadas na action,
com a regra permanecendo no domínio. Aviso não bloqueante de idade > 75 visível na tela.

## M5 — Contexto Pagamento + Auditoria (UI)

`Pagamento`, `PagamentoGrpDesconto`, `Auditoria`. Cálculo de bruto/descontos/líquido
exposto em tela, com o teto de 30% (INV-32) visível quando aciona.

## M6 — E2E + fechamento

Playwright contra o dev server (não contra build de produção — o guard de auth deve
recusar provedor de dev sob `NODE_ENV=production`, e abrir exceção destruiria a garantia).
Auditoria de proveniência final: veio da fonte × inferido × acrescentado × comportamento
alterado.

---

## Armadilhas já mapeadas para esta stack

Herdadas de `references/pitfalls-next-drizzle.md` — as que independem do ORM:

| # | Armadilha | Prevenção |
|---|---|---|
| 2 | Build exige `DATABASE_URL` | Cliente Prisma preguiçoso (aceite do M0) |
| 3 | Next pré-renderiza página que lê do banco | `export const dynamic = 'force-dynamic'` no layout do segmento |
| 5 | `server-only` quebra o Vitest | alias para stub no `vitest.config` |
| 6 | Playwright sobe o servidor antes da migração | encadear `db:migrate && db:seed && dev` no `webServer.command` |
| 7 | Toast intercepta clique | Toaster em `bottom-right` |
| 8 | `getByText` casa demais | `{ exact: true }` em badges de status |
| 9 | E2E poluindo o próprio banco | restaurar estado no fim do teste que alterou |
| 10 | Guard de auth × build de produção | E2E contra dev server |
| 11 | Zod 4 recusa `.pipe()` após `z.coerce` | `z.preprocess` |
| 12 | Variável de fonte com nome errado | conferir `getComputedStyle(document.body).fontFamily` |
| 13 | Vitest 4 exige Node ≥ 20.12 | Node 24.18 no ambiente; fixar com `.nvmrc` |

Novas armadilhas específicas de Prisma + SQLite descobertas durante a build serão
propostas para `references/pitfalls-next-prisma-sqlite.md`.
