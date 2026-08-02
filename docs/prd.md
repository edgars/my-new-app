# Product Requirements Document — SIFAP

## Overview

This PRD specifies the functional requirements for SIFAP, a modern rebuild of a legacy system. The requirements are derived from legacy UI screens, data models, and business rules recovered by RNC.

## Goals

- Preserve the behavior of the legacy system on a modern, supported stack.
- Provide full CRUD for every managed entity.
- Expose reference data as read-only lookups.
- Enforce the recovered business rules.

## Functional requirements

### Entity management

- **FR-01** — The system shall let a user list, create, view, edit and delete **ProgramaSocials** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/programa_socials`; required fields are validated.
- **FR-02** — The system shall let a user list, create, view, edit and delete **ProgramaSocialGrpFaixaCalculos** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/programa_social_grp_faixa_calculos`; required fields are validated.
- **FR-03** — The system shall let a user list, create, view, edit and delete **ProgramaSocialGrpParamRegionals** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/programa_social_grp_param_regionals`; required fields are validated.
- **FR-04** — The system shall let a user list, create, view, edit and delete **Auditorias** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/auditorias`; required fields are validated.
- **FR-05** — The system shall let a user list, create, view, edit and delete **Beneficiarios** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/beneficiarios`; required fields are validated.
- **FR-06** — The system shall let a user list, create, view, edit and delete **BeneficiarioGrpDependentes** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/beneficiario_grp_dependentes`; required fields are validated.
- **FR-07** — The system shall let a user list, create, view, edit and delete **Pagamentos** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/pagamentos`; required fields are validated.
- **FR-08** — The system shall let a user list, create, view, edit and delete **PagamentoGrpDescontos** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/pagamento_grp_descontos`; required fields are validated.

### Business rules

- **FR-09** — Conditional
  - *Condition:* `#OPER NE 'I' AND #OPER NE 'A'`
  - *Severity:* WARN · *Fields:* #OPER
- **FR-10** — Conditional
  - *Condition:* `#CPF = 0`
  - *Severity:* WARN · *Fields:* #CPF
- **FR-11** — Conditional
  - *Condition:* `NOT #CPF-VALIDO`
  - *Severity:* WARN
- **FR-12** — Conditional
  - *Condition:* `#NOME = ' '`
  - *Severity:* WARN · *Fields:* #NOME
- **FR-13** — Conditional
  - *Condition:* `#DT-NASC = 0`
  - *Severity:* WARN · *Fields:* #DT-NASC
- **FR-14** — Conditional
  - *Condition:* `#SEXO NE 'M' AND #SEXO NE 'F'`
  - *Severity:* WARN · *Fields:* #SEXO
- **FR-15** — Conditional
  - *Condition:* `#OPER = 'I' AND #FOUND`
  - *Severity:* WARN · *Fields:* #OPER
- **FR-16** — Conditional
  - *Condition:* `#OPER = 'A' AND NOT #FOUND`
  - *Severity:* WARN · *Fields:* #OPER
- **FR-17** — Age calculation (#ANO-ATUAL - #ANO-NASC) — Calc Idade Benef
  - *Condition:* `#ANO-ATUAL - #ANO-NASC`
  - *Severity:* WARN · *Fields:* #IDADE, #ANO-ATUAL, #ANO-NASC, BENEFICIARIO.DT-NASCIMENTO, #COMPETENCIA, #DT-NASC
- **FR-18** — Conditional
  - *Condition:* `#OPER = 'I'`
  - *Severity:* WARN · *Fields:* #OPER
- **FR-19** — Conditional
  - *Condition:* `#IDADE > 75`
  - *Severity:* WARN · *Fields:* BENEFICIARIO.DT-NASCIMENTO, #COMPETENCIA, #DT-NASC
- **FR-20** — Conditional
  - *Condition:* `#ERRO`
  - *Severity:* WARN
- **FR-21** — DECIDE ON #OPER
  - *Condition:* `#OPER`
  - *Severity:* WARN · *Fields:* #OPER
- **FR-22** — CPF check-digit weighted sum (#DIG × #PESO) — Primeiro Digito Verificador
  - *Condition:* `#SOMA + (#DIG(#I) * #PESO)`
  - *Severity:* WARN · *Fields:* #SOMA, #DIG, #PESO
- **FR-23** — CPF check-digit computation — modulo-11 remainder of #SOMA
  - *Condition:* `#SOMA - ((#SOMA / 11) * 11)`
  - *Severity:* WARN · *Fields:* #RESTO, #SOMA
- **FR-24** — Conditional
  - *Condition:* `#RESTO < 2`
  - *Severity:* WARN
- **FR-25** — CPF check digit from the modulo-11 remainder (11 - #RESTO)
  - *Condition:* `11 - #RESTO`
  - *Severity:* WARN · *Fields:* #DV1, #RESTO
- **FR-26** — Conditional
  - *Condition:* `#DV1 NE #DIG(10)`
  - *Severity:* WARN
- **FR-27** — CPF check-digit weighted sum (#DIG × #PESO) — Segundo Digito Verificador
  - *Condition:* `#SOMA + (#DIG(#I) * #PESO)`
  - *Severity:* WARN · *Fields:* #SOMA, #DIG, #PESO
- **FR-28** — CPF check-digit computation — modulo-11 remainder of #SOMA
  - *Condition:* `#SOMA - ((#SOMA / 11) * 11)`
  - *Severity:* WARN · *Fields:* #RESTO, #SOMA
- **FR-29** — Conditional
  - *Condition:* `#RESTO < 2`
  - *Severity:* WARN
- **FR-30** — CPF check digit from the modulo-11 remainder (11 - #RESTO)
  - *Condition:* `11 - #RESTO`
  - *Severity:* WARN · *Fields:* #DV2, #RESTO
- **FR-31** — Conditional
  - *Condition:* `#DV2 NE #DIG(11)`
  - *Severity:* WARN
- **FR-32** — Conditional
  - *Condition:* `*ERROR-NR NE 0