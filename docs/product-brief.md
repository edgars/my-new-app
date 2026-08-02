# Product Brief — SIFAP

## Overview

SIFAP replaces a legacy application that RNC reverse-engineered into a structured specification. The new system must reproduce the same functionality across **8 core entities**, supporting full create/read/update/delete workflows governed by **601 extracted business rules**.

## Problem

The legacy application runs on an unsupported technology stack that is expensive to maintain and cannot be extended without significant risk. The objective is a functionally equivalent replacement built on a modern, maintainable stack — no new features, no regressions.

## Target Users

The existing operator population who use the legacy system today. Their data, workflows, and mental model must be preserved exactly.

## In Scope

The following 8 entities must be fully manageable (create, read, update, delete) via the routes listed:

| Entity | Route |
|---|---|
| ProgramaSocials | `/programa_socials` |
| ProgramaSocialGrpFaixaCalculos | `/programa_social_grp_faixa_calculos` |
| ProgramaSocialGrpParamRegionals | `/programa_social_grp_param_regionals` |
| Auditorias | `/auditorias` |
| Beneficiarios | `/beneficiarios` |
| BeneficiarioGrpDependentes | `/beneficiario_grp_dependentes` |
| Pagamentos | `/pagamentos` |
| PagamentoGrpDescontos | `/pagamento_grp_descontos` |

All 601 business rules extracted during reverse-engineering must be implemented and verifiable.

## Out of Scope (First Build)

- **Data migration** from the legacy database — excluded from this phase entirely.
- **Net-new features** — nothing that does not exist in the legacy system will be built.

Both items are explicit deferral decisions, not oversights. They require a separate scoping conversation before any future phase begins.

## Target Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Backend | Next.js + Prisma |
| Database | SQLite |

The stack is fixed for this build. Any proposal to change it must be treated as a scope change and re-approved.