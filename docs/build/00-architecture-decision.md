# Decisão de arquitetura — SIFAP

## Sinais medidos no reconhecimento

| Sinal | Valor medido | Onde |
|---|---|---|
| Nº de entidades gerenciadas | 8 | `docs/architecture.md`, `docs/product-brief.md` |
| Tabelas de referência | 0 | `bmad-context.md` |
| Integrações externas **no escopo** | 0 | nenhum módulo de integração especificado |
| Integrações externas **evidenciadas nos dados** | 2 (SIAFI, rede bancária) | colunas `numObSiafi`, `numNeSiafi`, `sitIntegSiafi`, `hashArqRemessa`, `hashArqRetorno`, `codRetornoBanco` em `Pagamento` |
| Processos batch **no escopo** | 0 | nenhuma story de batch |
| Processos batch **evidenciados nos dados** | sim | colunas `numCicloBatch`, `numSeqBatch`, `nomJobBatch`, `sitBatch`, `desErroBatch` em `Auditoria` |
| Relatórios | 0 | nenhuma story de relatório |
| Consumidores além da web | 0 | — |

## Contagem de regras — a queda esperada

| Nível | Contagem |
|---|---|
| Alegado em `docs/product-brief.md` | 601 |
| Menções brutas nos epics (com duplicatas literais) | 270 |
| Rótulos distintos | 62 |
| Invariantes reais (ver `01-invariants.md`) | **39** |

A queda de 601 → 39 é o comportamento esperado de extração sobre código legado: a maior
parte do que o extrator devolve é encanamento (`Conditional` sem semântica, checagens de
`*ERROR-NR`, guardas de fluxo NATURAL) sem contraparte na web. `epic-beneficiarios.md`
repete o rótulo `Conditional` 40 vezes — são call-sites do mesmo teste, não 40 regras.

## Decisão: **A1 — Monólito em camadas**

**Motivo medido:** 8 módulos, 0 integrações no escopo, 0 batch no escopo, 1 consumidor
(web), 1 banco. A tabela de recomendação dá A1 para "≤ 30 módulos, sem integração, sem
batch". A2 não se paga com 8 entidades; A4 e A5 não têm sinal **no escopo desta build**.

**Ressalva registrada, não implementada:** os dados provam que o legado tinha integração
SIAFI, remessa/retorno bancário e batch noturno. Se esses processos entrarem em escopo
futuro, o contexto **Pagamento** passa a ter sinal para A4 (outbox transacional) — não o
sistema inteiro. Está fora desta build porque nenhuma story os descreve.

### Estrutura de pastas

```
src/
├── app/                    rotas e telas (Next.js App Router)
├── components/             UI — nunca fala com o banco
├── lib/                    schemas Zod, dinheiro (centavos), datas YYYYMMDD, erros
└── server/
    ├── db/                 client Prisma preguiçoso
    ├── queries/            leitura, consumida por Server Components
    ├── actions/            valida, transaciona, traduz erro, revalida
    └── domain/             REGRA DE NEGÓCIO — puro ou sobre `tx`
        ├── cpf.ts
        ├── idade.ts
        ├── beneficio.ts    cálculo do benefício
        ├── descontos.ts
        └── status.ts       máquinas de estado
```

## Stack

Fixa por `docs/product-brief.md` ("stack is fixed for this build"):

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js (App Router) |
| Backend | Next.js Server Actions + Route Handlers + Prisma |
| Banco | SQLite |

Acréscimos de ferramental (não são mudança de stack): Vitest, Playwright, Zod,
Tailwind + shadcn/ui, pnpm.

## Os quatro inegociáveis, e como ficam aqui

1. **Regra isolada da UI e do transporte** — `src/server/domain/`, funções puras.
2. **Escrita em transação; movimento de valor com lock explícito** — SQLite não tem
   `SELECT FOR UPDATE`. Substituto: `BEGIN IMMEDIATE` (via `prisma.$transaction`) +
   trava otimista pela coluna `numVersao`, que **já existe no legado** em `Beneficiario`.
3. **Constraint no banco como rede final** — `UNIQUE` em `beneficiario.num_cpf`,
   `beneficiario.num_inscricao`, `pagamento.num_pagamento`,
   `programa_social.cod_programa`. Ver divergência D-04.
4. **Teste de domínio sem UI, sem HTTP, sem framework** — Marco 1 fecha sem nenhuma tela.
