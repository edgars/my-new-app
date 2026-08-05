# Divergências entre artefatos da fonte — e o que foi adotado

Regra aplicada: **o artefato mais próximo do código vence**. `docs/prd.md` carrega
condições literais extraídas do NATURAL; `docs/product-brief.md` é resumo gerado.
Parser vence resumo.

| # | Ponto | Artefato A | Artefato B | Adotado | Motivo |
|---|---|---|---|---|---|
| D-01 | Nº de regras de negócio | `product-brief.md`: **601** | `prd.md`: **24 com condição**; epics: **62 rótulos distintos** | **62 rótulos → 39 invariantes** | 601 é contagem bruta de call-sites; os epics repetem o rótulo `Conditional` 40× no mesmo arquivo |
| D-02 | Campos obrigatórios | `prd.md` FR-01..08: "required fields are validated" | `DESIGN.md` e todas as stories: **`Required = no` em 100% dos campos** | **`prd.md` + regras FR-10..14** | "todos os campos opcionais" contradiz FR-12 (nome obrigatório) e FR-13 (data de nascimento obrigatória). A tabela de UI perdeu a nulidade; o bloco de regras a preservou |
| D-03 | Colunas de lista | `EXPERIENCE.md`: "list shows only *list column* fields" | `DESIGN.md`: **`List column = yes` em 100% dos campos** — 44 colunas em `Beneficiario`, 39 em `Pagamento` | **Subconjunto curado por entidade** (ver abaixo) | Tabela de 44 colunas não é tela, é despejo. O gerador marcou tudo `yes` por falta de sinal, não por decisão |
| D-04 | Unicidade | `architecture.md`: nenhuma constraint `UNIQUE` | `prd.md` FR-15/FR-16: `#OPER = 'I' AND #FOUND` ⇒ erro | **`UNIQUE` no banco** | FR-15 só faz sentido se a chave for única. O DDL perdeu a constraint; a regra a provou |
| D-05 | Severidade | `prd.md`: `Severity: WARN` nas **24** regras | sentido de cada regra (CPF zero, CPF inválido, sexo inválido) | **Severidade por sentido** | `WARN` uniforme em 100% dos casos é default do extrator, não decisão. INV-10 (idade > 75) fica como aviso; validações de formato bloqueiam |
| D-06 | `TIPO-PGTO` | epic: `DECIDE ON PAGAMENTO-V.TIPO-PGTO` | `architecture.md`: coluna **não existe** em `pagamento` | **Coluna não criada** | Regra órfã. Registrada em `01-invariants.md` INV-39 como pendência, não implementada às cegas |

## D-03 — colunas de lista adotadas

Todos os campos continuam nos formulários de criação e edição, na ordem da fonte. O corte
vale **apenas** para a tabela da listagem.

| Entidade | Colunas na listagem |
|---|---|
| ProgramaSocial | `codPrograma`, `nomePrograma`, `siglaPrograma`, `tipoPrograma`, `sitPrograma`, `vlrBaseIndividual` |
| ProgramaSocialGrpFaixaCalculo | `rendaInicio`, `rendaFim`, `fatorMultiplicador`, `vlrAdicional`, `indAcumulativo` (todas — só tem 5) |
| ProgramaSocialGrpParamRegional | `codRegiao`, `fatorRegional`, `vlrComplementoReg`, `indAtivoRegiao` (todas — só tem 4) |
| Auditoria | `dtEvento`, `hrEvento`, `codAcao`, `tipoEntidade`, `idEntidade`, `usrEvento` |
| Beneficiario | `numInscricao`, `numCpf`, `nomeCompleto`, `dtNascimento`, `uf`, `sitBeneficiario` |
| BeneficiarioGrpDependente | `cpfDependente`, `nomeDependente`, `dtNascDepend`, `parentesco`, `sitDependente` (todas — só tem 6) |
| Pagamento | `numPagamento`, `numCpf`, `anoMesRef`, `vlrBruto`, `vlrDescontoTotal`, `vlrLiquido`, `sitPagamento` |
| PagamentoGrpDesconto | `tipoDesconto`, `vlrDesconto`, `pctDesconto`, `dtInicioDsct`, `dtFimDsct` (todas — só tem 6) |

---

# Desvios do schema especificado — precisam de decisão

Estes **não** são divergências entre artefatos. São pontos onde `docs/architecture.md` é
internamente consistente e ainda assim produz sistema defeituoso. Nenhum foi aplicado em
silêncio.

## S-01 — Dinheiro em `Float` (impacto: alto)

`architecture.md` tipa `vlrBruto`, `vlrLiquido`, `vlrDesconto` etc. como `Float`. IEEE-754
não representa `0.1` exatamente; INV-21 exige truncamento em 2 casas no padrão mainframe.
Somar 6 descontos em `Float` e truncar produz centavos errados — silenciosamente.

**Adotado:** coluna permanece `Float` (fidelidade ao schema especificado), **mas toda
aritmética de valor acontece em centavos inteiros** em `src/lib/money.ts`, e só o
resultado já truncado é persistido. Preserva o schema e a corretude ao mesmo tempo.

**Alternativa não adotada:** trocar para `Int` (centavos) ou `Decimal`. Seria mudança de
schema, e o `product-brief.md` exige reaprovação para isso.

## S-02 — Entidades `Grp` órfãs (impacto: alto)

`ProgramaSocialGrpFaixaCalculo`, `ProgramaSocialGrpParamRegional`,
`BeneficiarioGrpDependente` e `PagamentoGrpDesconto` são grupos repetitivos (MU/PE) do
NATURAL — arrays filhos de um registro pai. `architecture.md` as gerou como entidades
**independentes, sem nenhuma FK**. Sem pai, INV-18, INV-19 e INV-28..31 são
inimplementáveis: não há como saber a que programa uma faixa pertence.

**Adotado:** mantém o CRUD independente que FR-02/03/06/08 exigem, **e acrescenta FK
anulável para o pai** (`programaSocialId`, `beneficiarioId`, `pagamentoId`). Marcado
`NOVO` no schema. É o mínimo para o "relations resolve" que os epics pedem no
*Definition of done*.

## S-03 — `Auditoria` com CRUD de escrita (impacto: alto)

FR-04 exige criar, editar e **excluir** registros de auditoria. Trilha de auditoria
editável não é trilha de auditoria. As colunas (`ipOrigem`, `idSessao`, `idCorrelacao`,
`hashArqRemessa`) mostram que o legado a tratava como log append-only.

**Decidido pelo usuário em 2026-08-02: CRUD completo, como FR-04 manda.** Fidelidade
estrita à fonte. O operador pode criar, editar e excluir registros de auditoria pela tela.

**Defeito herdado, registrado:** um operador com acesso à tela pode apagar o rastro do
próprio ato. As mutações feitas pelo servidor (M2) continuam gravando em `Auditoria`, mas
nada impede que sejam removidas depois. Isso reproduz o comportamento do legado, não o
corrige. Recomendação técnica para uma fase futura: listagem e detalhe somente leitura,
escrita exclusiva do servidor. Foi apresentada e recusada em favor da fidelidade.

## S-04 — Datas e horas em `Float` (impacto: baixo)

`dtNascimento`, `dtEvento`, `hrGeracao` etc. são `Float` — o formato mainframe
`YYYYMMDD` / `HHMMSS` como número. É fiel à fonte e INV-15 depende disso
(`ANO-NASC = trunc(dtNascimento / 10000)`).

**Adotado:** armazenamento permanece `Float`. `src/lib/dates.ts` converte nas bordas; a UI
usa seletor de data. Sem mudança de schema.

## S-05 — Ausência de autenticação (impacto: alto) — `NOVO`

O legado não tem auth no material extraído, mas tem `usrInclusao`, `usrUltAlteracao`,
`usrEvento`, `codPerfil` e `codLotacao` — havia usuário identificado. No rigor
**produção**, um CRUD de dados de CPF, renda familiar, biometria e conta bancária exposto
sem autenticação é inaceitável.

**Adotado:** auth *fail-closed* — toda rota e toda action negam por padrão; o usuário
autenticado preenche `usrInclusao` / `usrUltAlteracao`. Marcado `NOVO`.
