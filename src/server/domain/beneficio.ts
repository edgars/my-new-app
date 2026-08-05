/**
 * Cálculo do benefício.  INV-17 a INV-25.
 *
 * Função pura: recebe os parâmetros já lidos, não toca em banco.
 *
 * Aviso de leitura: destas 11 invariantes, **nenhuma** chegou com condição
 * literal. A fonte preservou só rótulos (`Derivation of #VLR-BENF — Aplicar
 * Reajuste Do Programa`), e os percentuais que existem estavam escritos dentro
 * do texto do rótulo. A ordem das operações foi inferida da cadeia de derivações.
 * Cada ponto inferido está marcado e devolvido em `presumidos`.
 */

import {
  emCentavos,
  emReais,
  multiplicarCentavos,
  percentualDeCentavos,
  truncarParaInteiro,
} from '@/lib/money'
import { mesDeAnoMes } from '@/lib/dates'

import { calcularFatorIdade, calcularFatorRnd, calcularIdadeNaCompetencia } from './idade'

/** INV-23 — abono natalino, 15%. Percentual literal no rótulo de origem. */
export const PCT_ABONO_NATALINO = 15

/** INV-23 — o abono só vale para programa deste tipo. Literal no rótulo. */
export const TIPO_PROGRAMA_COM_ABONO = 'A'

/** INV-24 — 13º e abono saem em dezembro. Literal no rótulo. */
export const MES_DECIMO_TERCEIRO = 12

export interface ProgramaParaCalculo {
  tipoPrograma: string | null
  vlrBaseIndividual: number | null
  vlrBaseFamiliar: number | null
  vlrPisoBenef: number | null
  vlrTetoBenef: number | null
  pctReajusteAnual: number | null
}

export interface BeneficiarioParaCalculo {
  dtNascimento: number | null
  vlrRendaFamiliar: number | null
  qtdMembrosFamilia: number | null
  indRendaPercap: number | null
  codRegiao: string | null
}

export interface FaixaCalculo {
  rendaInicio: number | null
  rendaFim: number | null
  fatorMultiplicador: number | null
  vlrAdicional: number | null
  indAcumulativo: string | null
}

export interface ParamRegional {
  codRegiao: string | null
  fatorRegional: number | null
  vlrComplementoReg: number | null
  indAtivoRegiao: string | null
}

export interface EntradaCalculoBeneficio {
  programa: ProgramaParaCalculo
  beneficiario: BeneficiarioParaCalculo
  faixas?: readonly FaixaCalculo[]
  paramsRegionais?: readonly ParamRegional[]
  /** Competência AAAAMM. Decide 13º e abono (INV-24) e a idade (INV-09). */
  anoMesRef: number | null
}

export interface ResultadoBeneficio {
  /** Todos em reais, já truncados em 2 casas (INV-21). */
  vlrBase: number
  vlrBenef: number
  vlr13: number
  vlrAbono: number
  vlrBruto: number
  idade: number | null
  fatorIdade: number
  fatorRnd: number
  fatorFaixa: number
  fatorRegional: number
  /** Lista de leituras adotadas que a fonte não sustenta. Exibir na tela. */
  presumidos: string[]
}

/**
 * INV-18 — faixa de cálculo por renda per capita.
 *
 * [PRESUMIDO] A entidade existe com rendaInicio, rendaFim, fatorMultiplicador,
 * vlrAdicional e indAcumulativo, mas **nenhum rótulo descreve como aplicá-la**.
 * Leitura adotada: seleciona a faixa cujo intervalo contém a renda per capita;
 * com indAcumulativo = 'S', acumula todas as faixas até a renda.
 * Ponto a confirmar nº 8 — impacto médio.
 */
export function aplicarFaixas(
  faixas: readonly FaixaCalculo[],
  rendaPerCapita: number,
): { fator: number; adicionalCentavos: number } {
  if (faixas.length === 0) return { fator: 1, adicionalCentavos: 0 }

  const acumulativo = faixas.some((f) => f.indAcumulativo?.toUpperCase() === 'S')

  const dentro = (f: FaixaCalculo) => {
    const ini = f.rendaInicio ?? 0
    const fim = f.rendaFim ?? Number.POSITIVE_INFINITY
    return rendaPerCapita >= ini && rendaPerCapita <= fim
  }

  const aplicaveis = acumulativo
    ? faixas.filter((f) => (f.rendaInicio ?? 0) <= rendaPerCapita)
    : faixas.filter(dentro).slice(0, 1)

  if (aplicaveis.length === 0) return { fator: 1, adicionalCentavos: 0 }

  const fator = aplicaveis.reduce((acc, f) => acc * (f.fatorMultiplicador ?? 1), 1)
  const adicionalCentavos = aplicaveis.reduce(
    (acc, f) => acc + emCentavos(f.vlrAdicional),
    0,
  )
  return { fator, adicionalCentavos }
}

/**
 * INV-19 — parâmetro regional.
 *
 * [PRESUMIDO] Só se aplica quando indAtivoRegiao = 'S'. A fonte dá as colunas,
 * não a regra de aplicação.
 */
export function aplicarParamRegional(
  params: readonly ParamRegional[],
  codRegiao: string | null,
): { fator: number; complementoCentavos: number } {
  if (!codRegiao) return { fator: 1, complementoCentavos: 0 }

  const p = params.find(
    (x) => x.codRegiao === codRegiao && x.indAtivoRegiao?.toUpperCase() === 'S',
  )
  if (!p) return { fator: 1, complementoCentavos: 0 }

  return {
    fator: p.fatorRegional ?? 1,
    complementoCentavos: emCentavos(p.vlrComplementoReg),
  }
}

/** Renda per capita: usa a coluna calculada se houver, senão deriva. */
export function rendaPerCapita(b: BeneficiarioParaCalculo): number {
  if (b.indRendaPercap != null && b.indRendaPercap > 0) return b.indRendaPercap
  const renda = b.vlrRendaFamiliar ?? 0
  const membros = b.qtdMembrosFamilia ?? 0
  if (membros <= 0) return renda
  return renda / membros
}

export function calcularBeneficio(entrada: EntradaCalculoBeneficio): ResultadoBeneficio {
  const { programa, beneficiario, anoMesRef } = entrada
  const faixas = entrada.faixas ?? []
  const paramsRegionais = entrada.paramsRegionais ?? []
  const presumidos: string[] = []

  // --- base de cálculo -----------------------------------------------------
  // [PRESUMIDO] Ponto a confirmar nº 6: nenhum rótulo diz quando usar a base
  // familiar. Leitura adotada: individual é a base; familiar só entra se a
  // individual estiver ausente.
  const baseCentavos =
    programa.vlrBaseIndividual != null
      ? emCentavos(programa.vlrBaseIndividual)
      : emCentavos(programa.vlrBaseFamiliar)
  if (programa.vlrBaseIndividual == null && programa.vlrBaseFamiliar != null) {
    presumidos.push('Base familiar usada por ausência de base individual (ponto 6).')
  }

  // --- fatores -------------------------------------------------------------
  const idade = calcularIdadeNaCompetencia(beneficiario.dtNascimento, anoMesRef)

  const fi = calcularFatorIdade(idade)
  if (fi.presumido) {
    presumidos.push(
      'FATOR-IDADE neutro (1,0): a curva idade→fator não existe na fonte (ponto 3, impacto alto).',
    )
  }

  const fr = calcularFatorRnd()
  if (fr.presumido) {
    presumidos.push(
      'FATOR-RND neutro (1,0): a origem do fator não existe na fonte (ponto 4, impacto alto).',
    )
  }

  const faixa = aplicarFaixas(faixas, rendaPerCapita(beneficiario))
  if (faixas.length > 0) {
    presumidos.push('Aplicação das faixas de cálculo é leitura adotada (ponto 8).')
  }

  const regional = aplicarParamRegional(paramsRegionais, beneficiario.codRegiao)

  // --- INV-17 — VLR-BENF = base × FATOR-RND × FATOR-IDADE -------------------
  // Trunca a cada etapa: o mainframe trabalha em campo de 2 casas, não acumula
  // precisão intermediária. Truncar só no fim daria centavos a mais.
  let benefCentavos = multiplicarCentavos(baseCentavos, fr.fator)
  benefCentavos = multiplicarCentavos(benefCentavos, fi.fator)
  benefCentavos = multiplicarCentavos(benefCentavos, faixa.fator)
  benefCentavos += faixa.adicionalCentavos
  benefCentavos = multiplicarCentavos(benefCentavos, regional.fator)
  benefCentavos += regional.complementoCentavos

  // --- INV-20 — aplicar reajuste do programa -------------------------------
  const pctReajuste = programa.pctReajusteAnual ?? 0
  if (pctReajuste !== 0) {
    benefCentavos += percentualDeCentavos(benefCentavos, pctReajuste)
  }

  // --- INV-22 — piso e teto ------------------------------------------------
  // [PRESUMIDO] Ponto a confirmar nº 5: a fonte não diz se o corte vem antes ou
  // depois do reajuste. Leitura adotada: depois — é o último ato do cálculo.
  const pisoCentavos = programa.vlrPisoBenef != null ? emCentavos(programa.vlrPisoBenef) : null
  const tetoCentavos = programa.vlrTetoBenef != null ? emCentavos(programa.vlrTetoBenef) : null

  if (pisoCentavos != null && benefCentavos < pisoCentavos) {
    benefCentavos = pisoCentavos
    presumidos.push('Piso aplicado após o reajuste — ordem é leitura adotada (ponto 5).')
  }
  if (tetoCentavos != null && benefCentavos > tetoCentavos) {
    benefCentavos = tetoCentavos
    presumidos.push('Teto aplicado após o reajuste — ordem é leitura adotada (ponto 5).')
  }

  // --- INV-24 — 13º e abono só em dezembro ---------------------------------
  const mes = mesDeAnoMes(anoMesRef)
  const ehDezembro = mes === MES_DECIMO_TERCEIRO

  // [PRESUMIDO] O rótulo dá o mês, não o valor. Leitura adotada: um benefício
  // integral, que é a definição corrente de 13º.
  let vlr13Centavos = 0
  if (ehDezembro) {
    vlr13Centavos = benefCentavos
    presumidos.push('13º = um benefício integral — o valor não está na fonte.')
  }

  // --- INV-23 — abono natalino, 15% de VLR-BENF, só tipo 'A' ---------------
  let abonoCentavos = 0
  if (ehDezembro && programa.tipoPrograma?.toUpperCase() === TIPO_PROGRAMA_COM_ABONO) {
    abonoCentavos = percentualDeCentavos(benefCentavos, PCT_ABONO_NATALINO)
  }

  // --- INV-25 — VLR-BRUTO agrega as três parcelas, cada uma truncada -------
  const brutoCentavos = benefCentavos + vlr13Centavos + abonoCentavos

  return {
    vlrBase: emReais(baseCentavos),
    vlrBenef: emReais(benefCentavos),
    vlr13: emReais(vlr13Centavos),
    vlrAbono: emReais(abonoCentavos),
    vlrBruto: emReais(brutoCentavos),
    idade,
    fatorIdade: fi.fator,
    fatorRnd: fr.fator,
    fatorFaixa: faixa.fator,
    fatorRegional: regional.fator,
    presumidos,
  }
}

/** Reexportado para os testes de truncamento por etapa. */
export const _internos = { truncarParaInteiro }
