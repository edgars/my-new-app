# Auditoria de proveniência — entrega final

Quatro listas exaustivas. **Nenhuma delas é "errada"** — mas quem for homologar
precisa saber em qual categoria cada coisa está.

---

## 1. Veio da fonte

| O quê | Artefato de origem |
|---|---|
| 8 tabelas, nomes de coluna e tipos | `docs/architecture.md` |
| Rotas `/entidade`, `/entidade/new`, `/entidade/[id]/edit` | `docs/ux/EXPERIENCE.md` |
| Ordem dos campos nos formulários e rótulos | `docs/ux/DESIGN.md` |
| Stack Next.js + Prisma + SQLite | `docs/product-brief.md` (declarada fixa) |
| INV-01 a INV-10 — validações de beneficiário, **com condição literal** | `docs/prd.md` FR-09 a FR-19 |
| INV-11 a INV-14 — algoritmo CPF mod-11 **completo** | `docs/prd.md` FR-22 a FR-31 |
| Percentual de 3% da contribuição social | rótulo `Desconto Basico - 3% Contrib Social` |
| Percentual de 1% do sindical | rótulo `Desconto Sindical` |
| Percentual de 15% do abono, e que só vale para tipo `A` | rótulo `Abono Natalino - 15% Adicional Para Programas Tipo 'A'` |
| Teto de desconto de 30% do bruto | rótulo `Calc Teto Maximo Desconto - 30% Do Bruto` |
| 13º e abono em dezembro | rótulo `13o Salario E Abono - Dezembro` |
| Truncamento em 2 casas, padrão mainframe | rótulo `Truncar P/ 2 Casas Decimais - Padrao Mainframe` |
| **Que `#VLR-ARR` arredonda enquanto o resto trunca** | rótulo `Nota: Arredondamento Difere Do Calcbenf (Round Vs Truncate)` — nota do autor original |
| Coluna `numVersao` (trava otimista) | `docs/architecture.md`, tabela `beneficiario` |
| Campos `usrInclusao`, `usrUltAlteracao`, `usrEvento`, `codPerfil`, `codLotacao` | `docs/architecture.md` |
| Que existe ramificação por `sitBeneficiario`, `sitPagamento`, `codAcao` | rótulos `DECIDE ON ...` |

## 2. Inferido — a fonte não deu a semântica

Todos marcados `[PRESUMIDO]` no código e listados em `01-invariants.md`.

| # | Inferência | Impacto | Onde |
|---|---|---|---|
| 1 | **Valores das 4 máquinas de estado** — os códigos `AT`, `SU`, `CN`, `GE`, `EM`, `CF`, `CC`, `INC`, `ALT`… são invenção | **Alto** | `domain/status.ts` |
| 2 | **Ordem de corte quando o teto de 30% estoura** | **Alto** | `domain/descontos.ts` `ORDEM_DE_CORTE` |
| 3 | **Curva idade → `FATOR-IDADE`** — devolve 1,0 neutro | **Alto** | `domain/idade.ts` |
| 4 | **Origem de `FATOR-RND`** — devolve 1,0 neutro | **Alto** | `domain/idade.ts` |
| 5 | Pesos do CPF (`10..2` e `11..2`) — a fonte só preservou `#PESO` | Baixo | `domain/cpf.ts` |
| 6 | Piso e teto aplicados **depois** do reajuste | Médio | `domain/beneficio.ts` |
| 7 | Base individual tem precedência; familiar só na ausência dela | Médio | `domain/beneficio.ts` |
| 8 | 13º = um benefício integral | Médio | `domain/beneficio.ts` |
| 9 | Aplicação das faixas de cálculo e do `indAcumulativo` | Médio | `domain/beneficio.ts` |
| 10 | Parâmetro regional só vale com `indAtivoRegiao = 'S'` | Médio | `domain/beneficio.ts` |
| 11 | Contribuição social e sindical aplicadas automaticamente | Médio | `domain/descontos.ts` |
| 12 | Sinal de `#DIFF` = conciliado − esperado | Baixo | `domain/conciliacao.ts` |
| 13 | Severidade real de cada regra — o extrator marcou **as 24** como `WARN` | Médio | divergência D-05 |
| 14 | Componente de UI por prefixo do nome | Baixo | divergência S-06 |

**Os quatro de impacto alto bloqueiam homologação do cálculo.** Enquanto os fatores
de idade e RND estiverem neutros, o valor calculado **não reproduz o legado** — e a
própria tela diz isso, listando as leituras adotadas em cada pagamento.

## 3. Acrescentado — não existe na fonte

| O quê | Justificativa | Onde |
|---|---|---|
| Tabelas `usuario` e `sessao`, login, sessão em banco | Rigor produção sobre CPF, renda, biometria e conta bancária. O legado gravava `usrEvento` e `codPerfil`: havia usuário identificado, só não foi extraído | S-05 |
| Autenticação *fail-closed* em toda leitura e escrita | Negar por padrão; autorizar é a exceção provada | `auth/sessao.ts` |
| FKs anuláveis nas 4 entidades `Grp` | Sem pai, INV-18, INV-19 e INV-28..31 são inimplementáveis | S-02 |
| Índices `UNIQUE` em `codPrograma`, `numCpf`, `numInscricao`, `numPagamento` | FR-15 só faz sentido se a chave for única; é a rede final contra corrida | D-04 |
| Rejeição de CPF com dígitos repetidos | `11111111111` passa no mod-11. Porta aberta para cadastro fantasma | `domain/cpf.ts` |
| Aritmética em centavos inteiros | Coluna `Float` + truncamento de 2 casas produz centavos errados sem emitir erro | S-01 |
| Retry de contenção do SQLite | `better-sqlite3` é síncrono; escrita concorrente trava a thread | `db/retry.ts` |
| Trilha de auditoria gravada pelo servidor | Torna rastreável quem alterou o quê | `audit/registrar.ts` |
| Listagem com subconjunto curado de colunas | A fonte marcava 100% dos campos como coluna de lista: 45 colunas é despejo, não tela | D-03 |
| Paginação e busca | Nenhuma story especifica, mas listagem sem paginação não sobrevive a volume real | `crud/servico.ts` |
| Painel de cálculo no Pagamento | O motor existe e está testado; sem tela, ninguém o exercita | `components/painel-calculo.tsx` |
| Exibição das leituras adotadas na própria tela | Quem opera precisa saber que o número não é definitivo | `components/painel-calculo.tsx` |

## 4. Comportamento alterado em relação ao original

| Mudança | Antes (legado) | Agora | Por quê |
|---|---|---|---|
| CPF de dígitos repetidos | Aceito (passa no mod-11) | Rejeitado | Cadastro fantasma em sistema de benefício. Desligável com `rejeitarRepetidos: false` |
| Severidade das regras | Tudo `WARN` no extrator | Bloqueio conforme o sentido de cada regra; só INV-10 (idade > 75) permanece aviso | `WARN` uniforme em 100% dos casos é default de extrator, não decisão. D-05 |
| Edição concorrente do mesmo registro | Última escrita vence, silenciosamente | Segunda falha com mensagem explícita | Desktop single-user não tinha a corrida; a web tem desde o primeiro dia |
| Inclusão duplicada sob concorrência | Sem defesa | `UNIQUE` no banco; erro traduzido em FR-15 | idem |
| Acesso ao sistema | Sem autenticação no material extraído | Login obrigatório, negando por padrão | S-05 |
| Campos `usr*` e `dt*` de carimbo | — | Preenchidos pelo servidor; valor enviado pelo cliente é descartado | POST direto poderia forjar autoria da trilha |
| Formato de identificadores numéricos | — | Sem separador de milhar | Competência 202411 renderizava como "202.411". Achado pelo E2E |

### Defeito herdado, mantido por decisão do usuário

**`Auditoria` com CRUD de escrita completo** (S-03, decidido em 2026-08-02). FR-04 exige
criar, editar e excluir registros de auditoria, e foi implementado como manda. Consequência:
um operador com acesso à tela pode apagar o rastro do próprio ato. As mutações continuam
gravando em `Auditoria`, mas nada impede que sejam removidas depois.

A alternativa (listagem e detalhe somente leitura, escrita exclusiva do servidor) foi
apresentada e recusada em favor da fidelidade à fonte.

---

## Fora de escopo, com sinal nos dados

O reconhecimento encontrou evidência de subsistemas que **nenhuma story descreve** e que
portanto não foram construídos:

| Evidência | Subsistema implícito |
|---|---|
| `numObSiafi`, `numNeSiafi`, `sitIntegSiafi`, `codUgEmitente`, `codGestao` | Integração SIAFI |
| `hashArqRemessa`, `hashArqRetorno`, `codRetornoBanco`, `desRetornoBanco` | Remessa e retorno bancário |
| `numCicloBatch`, `numSeqBatch`, `nomJobBatch`, `sitBatch`, `desErroBatch` | Processamento batch noturno |
| `indExigeFilhos`, `indExigeEscola`, `indExigeVacina`, `indExigePrenatal`, `indExigeBiometria`, `idadeMin`, `idadeMax`, `rendaMaxPercap`, `fatorK` | Regras de elegibilidade — colunas existem, **nenhuma regra extraída as usa** |

Se esses entrarem em escopo, o contexto **Pagamento** passa a ter sinal para arquitetura
orientada a eventos (A4, com outbox transacional) — não o sistema inteiro.

---

## Como isto foi verificado

| Verificação | Comando | Resultado |
|---|---|---|
| Domínio | `pnpm test` | 148 testes, 10 arquivos |
| Concorrência | incluída acima | 8 inserções paralelas do mesmo CPF ⇒ 1 registro |
| Tipos | `pnpm typecheck` | limpo |
| Lint | `pnpm lint` | limpo |
| Build sem banco | `mv .env .env.bak && env -u DATABASE_URL pnpm build` | passa |
| Ponta a ponta | `pnpm test:e2e` | 19 testes em navegador real |
| Renderizado × banco | `curl` da listagem × `findMany` direto | bate coluna a coluna |
| Contadores | 5 casos, incluindo filtrado e zero | sem o bug de contador sempre-zero |
| Isolamento dos bancos | contagem em `dev.db` e `e2e.db` | E2E não polui o banco de desenvolvimento |
