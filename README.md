# Generated application

Modernized from a legacy system by RNC.

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## Entities

- Funcionario — `/funcionarios`
- TipoFuncionario — `/tipo_funcionarios`
- AuditoriaDetalhadaFuncionario — `/auditoria_detalhada_funcionarios`
- FuncaoQdi — `/funcao_qdis`

## Run

```
npm install
npx prisma migrate dev
npm run dev
```
