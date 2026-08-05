# Invariantes — catálogo com proveniência

39 invariantes destilados de 601 regras alegadas / 270 menções brutas / 62 rótulos
distintos. Cada linha cita a origem.

**Legenda de proveniência**

| Marca | Significado |
|---|---|
| `FONTE` | condição literal presente em `docs/prd.md` — maior fidelidade disponível |
| `RÓTULO` | só o rótulo existe (`docs/epics/*.md`); a semântica foi lida do texto do rótulo |
| `[PRESUMIDO]` | a fonte não dá a semântica; leitura adotada precisa de confirmação humana |
| `NOVO` | não existe na fonte; acrescentado por julgamento, com justificativa |

---

## A. Validação de Beneficiário — 10 invariantes

Todas com condição literal em `docs/prd.md`. É o único bloco onde a fonte preservou
expressões executáveis.

| ID | Regra | Condição na fonte | Origem | Marca |
|---|---|---|---|---|
| INV-01 | `OPER` deve ser `I` ou `A` | `#OPER NE 'I' AND #OPER NE 'A'` | FR-09 | FONTE |
| INV-02 | CPF não pode ser zero | `#CPF = 0` | FR-10 | FONTE |
| INV-03 | CPF deve passar no dígito verificador | `NOT #CPF-VALIDO` | FR-11 | FONTE |
| INV-04 | Nome não pode ser branco | `#NOME = ' '` | FR-12 | FONTE |
| INV-05 | Data de nascimento obrigatória | `#DT-NASC = 0` | FR-13 | FONTE |
| INV-06 | Sexo deve ser `M` ou `F` | `#SEXO NE 'M' AND #SEXO NE 'F'` | FR-14 | FONTE |
| INV-07 | Inclusão de CPF já existente é erro | `#OPER = 'I' AND #FOUND` | FR-15 | FONTE |
| INV-08 | Alteração de CPF inexistente é erro | `#OPER = 'A' AND NOT #FOUND` | FR-16 | FONTE |
| INV-09 | Idade = ano atual − ano de nascimento | `#ANO-ATUAL - #ANO-NASC` | FR-17 | FONTE |
| INV-10 | Idade > 75 emite alerta | `#IDADE > 75` | FR-19 | FONTE |

**INV-10 — severidade.** `docs/prd.md` diz `Severity: WARN`. Adotado como **aviso não
bloqueante**: grava, mas devolve alerta. `[PRESUMIDO]` que não bloqueia — a fonte marca
literalmente **todas** as 24 regras como WARN, inclusive INV-02 (CPF zero), que
obviamente bloqueia. Logo `Severity` do extrator **não é sinal confiável de bloqueio**;
a severidade real foi lida do sentido de cada regra. Registrado como divergência D-05.

## B. CPF — dígito verificador mod-11 — 4 invariantes

Este é o bloco de maior valor recuperado: o algoritmo veio **completo** em `docs/prd.md`,
não apenas rotulado.

| ID | Regra | Condição na fonte | Origem | Marca |
|---|---|---|---|---|
| INV-11 | Soma ponderada dos dígitos | `#SOMA + (#DIG(#I) * #PESO)` | FR-22, FR-27 | FONTE |
| INV-12 | Resto = módulo 11 da soma | `#SOMA - ((#SOMA / 11) * 11)` | FR-23, FR-28 | FONTE |
| INV-13 | Resto < 2 ⇒ dígito 0; senão `11 - resto` | `#RESTO < 2` / `11 - #RESTO` | FR-24/25, FR-29/30 | FONTE |
| INV-14 | DV1 e DV2 conferem com as posições 10 e 11 | `#DV1 NE #DIG(10)`, `#DV2 NE #DIG(11)` | FR-26, FR-31 | FONTE |

`#SOMA / 11` em NATURAL sobre campo inteiro é divisão inteira. Implementar com
`Math.trunc`, não com divisão de ponto flutuante.

## C. Cálculo do benefício — 11 invariantes

Só rótulos. Os percentuais estão **dentro do texto do rótulo** e foram lidos de lá; a
ordem das operações foi inferida da cadeia de derivações.

| ID | Regra | Rótulo de origem | Marca |
|---|---|---|---|
| INV-15 | `ANO-NASC` derivado de `dtNascimento` (YYYYMMDD) | `Derivation of #ANO-NASC — Calc Fator Idade` | RÓTULO |
| INV-16 | `FATOR-IDADE` derivado da idade | `Age calculation (#ANO - #ANO-NASC) — Calc Fator Idade` | RÓTULO + `[PRESUMIDO]` (a curva idade→fator não está na fonte) |
| INV-17 | `VLR-BENF = base × FATOR-RND × FATOR-IDADE` | `Derivation of #VLR-BENF — #Fator-Rnd * #Fator-Idade` | RÓTULO |
| INV-18 | Faixa de cálculo: renda per capita ⇒ `fatorMultiplicador` + `vlrAdicional`, respeitando `indAcumulativo` | entidade `ProgramaSocialGrpFaixaCalculo` | RÓTULO + `[PRESUMIDO]` |
| INV-19 | Parâmetro regional: `fatorRegional` + `vlrComplementoReg`, só se `indAtivoRegiao` | entidade `ProgramaSocialGrpParamRegional` | RÓTULO + `[PRESUMIDO]` |
| INV-20 | Aplicar reajuste do programa (`pctReajusteAnual`) | `Derivation of #VLR-BENF — Aplicar Reajuste Do Programa` | RÓTULO |
| INV-21 | **Truncar** para 2 casas — padrão mainframe, não arredondar | `Derivation of #VLR-BENF — Truncar P/ 2 Casas Decimais - Padrao Mainframe` | FONTE (o rótulo é explícito) |
| INV-22 | Piso e teto do benefício (`vlrPisoBenef`, `vlrTetoBenef`) | colunas de `ProgramaSocial` | `[PRESUMIDO]` — nenhum rótulo descreve a aplicação |
| INV-23 | Abono natalino = **15%** de `VLR-BENF`, só para programa tipo `A` | `Percentage calculation (15% of #VLR-BENF) — Abono Natalino - 15% Adicional Para Programas Tipo 'A'` | RÓTULO |
| INV-24 | 13º salário e abono em **dezembro** | `Derivation of #VLR-13 — 13o Salario E Abono - Dezembro` | RÓTULO |
| INV-25 | `VLR-BRUTO` agrega benefício + 13º + abono, cada parcela truncada | `Derivation of #VLR-BRUTO — Truncar 13o` / `Truncar Abono` | RÓTULO |

## D. Descontos — 8 invariantes

Percentuais literais no rótulo. Alta confiança nos números, baixa na ordem de aplicação.

| ID | Regra | Rótulo de origem | Marca |
|---|---|---|---|
| INV-26 | Contribuição social = **3%** de `VLR-BRUTO` | `Percentage calculation (3% of #VLR-BRUTO) — Desconto Basico - 3% Contrib Social` | RÓTULO |
| INV-27 | Sindical = **1%** de `VLR-BRUTO` | `Percentage calculation (1% of #VLR-BRUTO) — Desconto Sindical` | RÓTULO |
| INV-28 | Judicial = valor fixo **ou** percentual | `... — Desconto Judicial - Valor Fixo Ou Percentual` | RÓTULO |
| INV-29 | Pensão alimentícia = percentual de `VLR-BRUTO` | `... — Pensao Alimenticia` | RÓTULO |
| INV-30 | Imposto retido = percentual de `VLR-BRUTO` | `... — Imposto Retido` | RÓTULO |
| INV-31 | Administrativo = percentual de `VLR-BRUTO` | `... — Desconto Administrativo` | RÓTULO |
| INV-32 | **Teto de desconto = 30% de `VLR-BRUTO`** | `Percentage calculation (30% of #VLR-BRUTO) — Calc Teto Maximo Desconto - 30% Do Bruto` | RÓTULO |
| INV-33 | `VLR-LIQ = VLR-BRUTO − VLR-TOTAL-DSCT`, ambos truncados | `Derivation of #VLR-LIQ — Truncar Liquido` | RÓTULO |

**INV-32 — ordem de corte.** Quando a soma dos descontos passa de 30%, a fonte não diz
**qual** desconto é cortado. `[PRESUMIDO]`: corta na ordem inversa de prioridade legal
(administrativo → sindical → judicial → pensão), preservando pensão alimentícia. Impacto
**alto** — muda o valor pago. Pendente de confirmação.

## E. Conciliação e correção — 3 invariantes

| ID | Regra | Rótulo de origem | Marca |
|---|---|---|---|
| INV-34 | `VLR-CORR` = valor com correção aplicada, truncado | `Derivation of #VLR-CORR — Aplicar Correcao` | RÓTULO |
| INV-35 | `#DIFF` = diferença de conciliação bancária, truncada | `Derivation of #DIFF — Conciliar Valores` | RÓTULO |
| INV-36 | `VLR-ARR` **arredonda** — não trunca | `Derivation of #VLR-ARR — Nota: Arredondamento Difere Do Calcbenf (Round Vs Truncate)` | FONTE (o rótulo é uma nota explícita do autor original) |

INV-36 é a inconsistência mais valiosa recuperada: o próprio código legado documenta que
**um** caminho arredonda enquanto todos os outros truncam. Reproduzir isso é fidelidade;
"consertar" seria regressão silenciosa. Implementado como está, com o comentário citando
a nota.

## F. Máquinas de estado — 4 invariantes

Existem como `DECIDE ON <campo>` — o extrator preservou o **campo**, não os **valores**.

| ID | Campo | Rótulo de origem | Marca |
|---|---|---|---|
| INV-37 | `Beneficiario.sitBeneficiario` | `DECIDE ON BENEFICIARIO-V.STATUS` | `[PRESUMIDO]` — valores inventados |
| INV-38 | `Pagamento.sitPagamento` | `DECIDE ON PAGAMENTO-V.STATUS-PGTO` | `[PRESUMIDO]` — valores inventados |
| INV-39 | `Pagamento` tipo de pagamento | `DECIDE ON PAGAMENTO-V.TIPO-PGTO` | `[PRESUMIDO]` — o campo não existe no schema (ver D-06) |
| — | `Auditoria.codAcao` | `DECIDE ON AUDITORIA-V.ACAO` | `[PRESUMIDO]` — valores inventados |

**Impacto alto.** Os valores de estado e as transições permitidas são invenção.
Recomendação: extrair do banco legado antes de homologar.

---

## Pontos a confirmar — ordenados por impacto

| # | Ponto | Invariante | Impacto |
|---|---|---|---|
| 1 | Valores e transições das 4 máquinas de estado | INV-37..39 | **Alto** — bloqueia operação real |
| 2 | Qual desconto é cortado ao estourar o teto de 30% | INV-32 | **Alto** — muda valor pago |
| 3 | Curva idade → `FATOR-IDADE` | INV-16 | **Alto** — muda valor pago |
| 4 | Origem de `FATOR-RND` (arredondamento? regional? renda?) | INV-17 | **Alto** — muda valor pago |
| 5 | Como piso e teto do benefício se aplicam (antes ou depois do reajuste) | INV-22 | Médio |
| 6 | Base de cálculo: `vlrBaseIndividual` ou `vlrBaseFamiliar`, e o critério | INV-17 | Médio |
| 7 | Uso de `fatorK` e `rendaMaxPercap` — colunas sem nenhuma regra associada | — | Médio |
| 8 | `indAcumulativo` das faixas: soma faixas ou usa só a faixa da renda | INV-18 | Médio |
| 9 | Severidade real de cada regra (o extrator marcou tudo WARN) | todas | Médio |
| 10 | Condições de elegibilidade (`indExigeFilhos`, `indExigeEscola`, `indExigeVacina`, `indExigePrenatal`, `indExigeBiometria`, `idadeMin`, `idadeMax`) — colunas existem, nenhuma regra extraída as usa | — | Médio |
