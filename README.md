# Generated application

Modernized from a legacy system by RNC.

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## Entities

- Habilitacao — `/habilitacaos`
- Funcionario — `/funcionarios`
- TipoFuncionario — `/tipo_funcionarios`
- Atribuicao — `/atribuicaos`
- AuditoriaDetalhadaFuncionario — `/auditoria_detalhada_funcionarios`
- PostoGraduacao — `/posto_graduacaos`
- FuncaoQdi — `/funcao_qdis`

## Run

```
npm install
npx prisma migrate dev
npm run dev
```
