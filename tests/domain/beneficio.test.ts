import { describe, expect, it } from 'vitest'

import {
  aplicarFaixas,
  aplicarParamRegional,
  calcularBeneficio,
  PCT_ABONO_NATALINO,
  rendaPerCapita,
  type EntradaCalculoBeneficio,
} from '@/server/domain/beneficio'

const programaBase = {
  tipoPrograma: 'B',
  vlrBaseIndividual: 1000,
  vlrBaseFamiliar: null,
  vlrPisoBenef: null,
  vlrTetoBenef: null,
  pctReajusteAnual: null,
}

const beneficiarioBase = {
  dtNascimento: 19850312,
  vlrRendaFamiliar: null,
  qtdMembrosFamilia: null,
  indRendaPercap: null,
  codRegiao: null,
}

function calcular(over: Partial<EntradaCalculoBeneficio> = {}) {
  return calcularBeneficio({
    programa: programaBase,
    beneficiario: beneficiarioBase,
    anoMesRef: 202406,
    ...over,
  })
}

describe('INV-17 — VLR-BENF = base × FATOR-RND × FATOR-IDADE', () => {
  it('com os dois fatores neutros, o benefício é a base', () => {
    const r = calcular()
    expect(r.vlrBase).toBe(1000)
    expect(r.vlrBenef).toBe(1000)
  })

  it('devolve os fatores usados, para a tela poder exibir', () => {
    const r = calcular()
    expect(r.fatorIdade).toBe(1)
    expect(r.fatorRnd).toBe(1)
  })

  it('sinaliza que os dois fatores são presumidos — pontos 3 e 4, impacto alto', () => {
    const r = calcular()
    expect(r.presumidos.some((p) => p.includes('FATOR-IDADE'))).toBe(true)
    expect(r.presumidos.some((p) => p.includes('FATOR-RND'))).toBe(true)
  })
})

describe('INV-20 — reajuste do programa', () => {
  it('aplica o percentual sobre o benefício', () => {
    const r = calcular({
      programa: { ...programaBase, pctReajusteAnual: 5 },
    })
    expect(r.vlrBenef).toBe(1050)
  })

  it('trunca a fração de centavo do reajuste (INV-21)', () => {
    // 5% de R$ 333,33 = R$ 16,6665 → trunca para R$ 16,66
    const r = calcular({
      programa: { ...programaBase, vlrBaseIndividual: 333.33, pctReajusteAnual: 5 },
    })
    expect(r.vlrBenef).toBe(349.99)
  })
})

describe('INV-22 — piso e teto', () => {
  it('eleva ao piso', () => {
    const r = calcular({
      programa: { ...programaBase, vlrBaseIndividual: 100, vlrPisoBenef: 500 },
    })
    expect(r.vlrBenef).toBe(500)
    expect(r.presumidos.some((p) => p.includes('Piso'))).toBe(true)
  })

  it('corta no teto', () => {
    const r = calcular({
      programa: { ...programaBase, vlrBaseIndividual: 9000, vlrTetoBenef: 2000 },
    })
    expect(r.vlrBenef).toBe(2000)
  })

  it('não mexe no valor quando está entre piso e teto', () => {
    const r = calcular({
      programa: { ...programaBase, vlrPisoBenef: 500, vlrTetoBenef: 2000 },
    })
    expect(r.vlrBenef).toBe(1000)
    expect(r.presumidos.some((p) => p.includes('Piso'))).toBe(false)
  })
})

describe('INV-24 — 13º e abono só em dezembro', () => {
  it('em junho não paga 13º nem abono', () => {
    const r = calcular({ anoMesRef: 202406 })
    expect(r.vlr13).toBe(0)
    expect(r.vlrAbono).toBe(0)
    expect(r.vlrBruto).toBe(1000)
  })

  it('em dezembro paga 13º integral', () => {
    const r = calcular({ anoMesRef: 202412 })
    expect(r.vlr13).toBe(1000)
    expect(r.vlrBruto).toBe(2000)
  })
})

describe("INV-23 — abono natalino, 15%, só para programa tipo 'A'", () => {
  it('paga o abono em dezembro para o tipo A', () => {
    const r = calcular({
      programa: { ...programaBase, tipoPrograma: 'A' },
      anoMesRef: 202412,
    })
    expect(PCT_ABONO_NATALINO).toBe(15)
    expect(r.vlrAbono).toBe(150) // 15% de 1000
    expect(r.vlrBruto).toBe(2150) // benefício + 13º + abono
  })

  it('não paga o abono para outro tipo de programa, mesmo em dezembro', () => {
    const r = calcular({
      programa: { ...programaBase, tipoPrograma: 'B' },
      anoMesRef: 202412,
    })
    expect(r.vlrAbono).toBe(0)
    expect(r.vlrBruto).toBe(2000)
  })

  it('não paga o abono para o tipo A fora de dezembro', () => {
    const r = calcular({
      programa: { ...programaBase, tipoPrograma: 'A' },
      anoMesRef: 202411,
    })
    expect(r.vlrAbono).toBe(0)
  })
})

describe('INV-18 — faixas de cálculo', () => {
  const faixas = [
    { rendaInicio: 0, rendaFim: 500, fatorMultiplicador: 1.5, vlrAdicional: 100, indAcumulativo: 'N' },
    { rendaInicio: 501, rendaFim: 1000, fatorMultiplicador: 1.2, vlrAdicional: 50, indAcumulativo: 'N' },
  ]

  it('seleciona só a faixa que contém a renda per capita', () => {
    const r = aplicarFaixas(faixas, 300)
    expect(r.fator).toBe(1.5)
    expect(r.adicionalCentavos).toBe(10000)
  })

  it('seleciona a segunda faixa quando a renda sobe', () => {
    const r = aplicarFaixas(faixas, 800)
    expect(r.fator).toBe(1.2)
    expect(r.adicionalCentavos).toBe(5000)
  })

  it('acumula todas as faixas até a renda quando indAcumulativo = S', () => {
    const acumulativas = faixas.map((f) => ({ ...f, indAcumulativo: 'S' }))
    const r = aplicarFaixas(acumulativas, 800)
    expect(r.fator).toBeCloseTo(1.5 * 1.2)
    expect(r.adicionalCentavos).toBe(15000)
  })

  it('sem faixa aplicável devolve o elemento neutro', () => {
    const r = aplicarFaixas(faixas, 99999)
    expect(r.fator).toBe(1)
    expect(r.adicionalCentavos).toBe(0)
  })

  it('lista vazia devolve o elemento neutro', () => {
    expect(aplicarFaixas([], 300)).toEqual({ fator: 1, adicionalCentavos: 0 })
  })
})

describe('INV-19 — parâmetro regional', () => {
  const params = [
    { codRegiao: 'NE', fatorRegional: 1.3, vlrComplementoReg: 200, indAtivoRegiao: 'S' },
    { codRegiao: 'SU', fatorRegional: 1.1, vlrComplementoReg: 50, indAtivoRegiao: 'N' },
  ]

  it('aplica o parâmetro da região quando está ativo', () => {
    const r = aplicarParamRegional(params, 'NE')
    expect(r.fator).toBe(1.3)
    expect(r.complementoCentavos).toBe(20000)
  })

  it('ignora o parâmetro da região inativa', () => {
    const r = aplicarParamRegional(params, 'SU')
    expect(r).toEqual({ fator: 1, complementoCentavos: 0 })
  })

  it('sem região devolve o elemento neutro', () => {
    expect(aplicarParamRegional(params, null)).toEqual({ fator: 1, complementoCentavos: 0 })
  })
})

describe('renda per capita', () => {
  it('usa a coluna calculada quando ela existe', () => {
    expect(rendaPerCapita({ ...beneficiarioBase, indRendaPercap: 250 })).toBe(250)
  })

  it('deriva de renda familiar ÷ membros quando não existe', () => {
    expect(
      rendaPerCapita({
        ...beneficiarioBase,
        vlrRendaFamiliar: 1200,
        qtdMembrosFamilia: 4,
      }),
    ).toBe(300)
  })

  it('não divide por zero', () => {
    expect(
      rendaPerCapita({
        ...beneficiarioBase,
        vlrRendaFamiliar: 1200,
        qtdMembrosFamilia: 0,
      }),
    ).toBe(1200)
  })
})

describe('cálculo completo — cadeia inteira', () => {
  it('compõe faixa, regional, reajuste, 13º e abono na ordem adotada', () => {
    const r = calcular({
      programa: {
        ...programaBase,
        tipoPrograma: 'A',
        vlrBaseIndividual: 1000,
        pctReajusteAnual: 10,
      },
      beneficiario: { ...beneficiarioBase, indRendaPercap: 300, codRegiao: 'NE' },
      faixas: [
        { rendaInicio: 0, rendaFim: 500, fatorMultiplicador: 1.5, vlrAdicional: 100, indAcumulativo: 'N' },
      ],
      paramsRegionais: [
        { codRegiao: 'NE', fatorRegional: 1.2, vlrComplementoReg: 50, indAtivoRegiao: 'S' },
      ],
      anoMesRef: 202412,
    })

    // base 1000,00 → ×1 ×1 (fatores neutros) → ×1,5 = 1500,00 → +100,00 = 1600,00
    // → ×1,2 = 1920,00 → +50,00 = 1970,00 → +10% = 2167,00
    expect(r.vlrBenef).toBe(2167)
    // dezembro: 13º integral + abono de 15% (tipo A)
    expect(r.vlr13).toBe(2167)
    expect(r.vlrAbono).toBe(325.05)
    expect(r.vlrBruto).toBe(4659.05)
  })

  it('base familiar entra só quando a individual falta, e avisa', () => {
    const r = calcular({
      programa: { ...programaBase, vlrBaseIndividual: null, vlrBaseFamiliar: 800 },
    })
    expect(r.vlrBase).toBe(800)
    expect(r.presumidos.some((p) => p.includes('Base familiar'))).toBe(true)
  })

  it('calcula a idade na competência, não na data de hoje', () => {
    const r = calcular({ anoMesRef: 202412 })
    expect(r.idade).toBe(2024 - 1985)
  })
})
