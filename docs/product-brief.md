# Product Brief — JP-Delphi

## Overview

JP-Delphi replaces a legacy application that RNC reverse-engineered into a structured specification. The new system must reproduce the same functionality across 8 core entities, each with full create/read/update/delete workflows. The reverse-engineering effort extracted 112 discrete business rules that the new build must satisfy.

## Problem

The existing application runs on an unsupported legacy stack that is expensive to maintain and difficult to extend. The objective is a functionally equivalent replacement on a modern, actively supported technology stack — no new features, no regressions.

## Target Users

The operators who use the legacy system today. Their data, workflows, and mental models are preserved exactly; this is a platform change, not a product change.

## In Scope

The following 8 entities must support full CRUD operations at the listed routes:

| Entity | Route |
|---|---|
| Parts | `/parts` |
| Nextcusts | `/nextcusts` |
| Vendors | `/vendors` |
| Orders | `/orders` |
| Customers | `/customers` |
| Items | `/items` |
| Nextords | `/nextords` |
| Employees | `/employees` |

All 112 extracted business rules must be implemented and verifiable against the legacy system's behavior.

## Out of Scope (First Build)

- **Data migration** from the legacy database — excluded from this phase
- **Net-new features** — nothing beyond what the legacy system already does

## Target Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js |
| Backend | Next.js + Prisma |
| Database | SQLite |