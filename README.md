# Generated application

Modernized from a legacy system by RNC.

## Stack

- Frontend: nextjs
- Backend: nextjs + prisma
- Database: sqlite

## Entities

- Auditoria — `/auditorias`
- Pagamento — `/pagamentos`
- PagamentoGrpDesconto — `/pagamento_grp_descontos`
- ProgramaSocial — `/programa_socials`
- ProgramaSocialGrpFaixaCalculo — `/programa_social_grp_faixa_calculos`
- ProgramaSocialGrpParamRegional — `/programa_social_grp_param_regionals`
- Beneficiario — `/beneficiarios`
- BeneficiarioGrpDependente — `/beneficiario_grp_dependentes`

## Run

```
npm install
npx prisma migrate dev
npm run dev
```
