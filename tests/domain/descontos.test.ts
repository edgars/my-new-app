import { describe, expect, it } from 'vitest'

import {
  calcularDescontos,
  ORDEM_DE_CORTE,
  PCT_CONTRIB_SOCIAL,
  PCT_SINDICAL,
  PCT_TETO_DESCONTO,
  TIPO_DESCONTO,
  valorDoDescontoEmCentavos,
} from '@/server/domain/descontos'

describe('percentuais literais do rótulo de origem', () => {
  it('são exatamente os que a fonte escreveu', () => {
    expect(PCT_CONTRIB_SOCIAL).toBe(3)
    expect(PCT_SINDICAL).toBe(1)
    expect(PCT_TETO_DESCONTO).toBe(30)
  })
})

describe('INV-26/INV-27 — descontos automáticos', () => {
  it('aplica 3% de contribuição social e 1% de sindical sobre o bruto', () => {
    const r = calcularDescontos({ vlrBruto: 1000 })
    const cs = r.itens.find((i) => i.tipo === TIPO_DESCONTO.CONTRIB_SOCIAL)
    const si = r.itens.find((i) => i.tipo === TIPO_DESCONTO.SINDICAL)
    expect(cs?.valorAplicado).toBe(30)
    expect(si?.valorAplicado).toBe(10)
    expect(r.vlrDescontoTotal).toBe(40)
  })

  it('INV-33 — líquido é bruto menos o total', () => {
    const r = calcularDescontos({ vlrBruto: 1000 })
    expect(r.vlrLiquido).toBe(960)
  })

  it('trunca a fração de centavo em vez de arredondar (INV-21)', () => {
    // 3% de 333,33 = 9,9999 → 9,99 ; 1% = 3,3333 → 3,33
    const r = calcularDescontos({ vlrBruto: 333.33 })
    expect(r.itens.map((i) => i.valorAplicado)).toEqual([9.99, 3.33])
    expect(r.vlrDescontoTotal).toBe(13.32)
    expect(r.vlrLiquido).toBe(320.01)
  })

  it('podem ser desligados', () => {
    const r = calcularDescontos({ vlrBruto: 1000, incluirAutomaticos: false })
    expect(r.itens).toHaveLength(0)
    expect(r.vlrLiquido).toBe(1000)
  })

  it('avisa que a condição de aplicação é presumida', () => {
    const r = calcularDescontos({ vlrBruto: 1000 })
    expect(r.presumidos.some((p) => p.includes('automaticamente'))).toBe(true)
  })
})

describe('INV-28 — judicial: valor fixo OU percentual', () => {
  it('valor fixo tem precedência, como o rótulo escreve', () => {
    const centavos = valorDoDescontoEmCentavos(
      { tipoDesconto: 'JU', vlrDesconto: 100, pctDesconto: 50 },
      emCentavosDeReais(1000),
    )
    expect(centavos).toBe(10000) // R$ 100,00 fixo, não 50% de 1000
  })

  it('cai no percentual quando não há valor fixo', () => {
    const centavos = valorDoDescontoEmCentavos(
      { tipoDesconto: 'JU', vlrDesconto: null, pctDesconto: 5 },
      emCentavosDeReais(1000),
    )
    expect(centavos).toBe(5000)
  })

  it('sem fixo e sem percentual, desconta zero', () => {
    expect(
      valorDoDescontoEmCentavos(
        { tipoDesconto: 'JU', vlrDesconto: null, pctDesconto: null },
        emCentavosDeReais(1000),
      ),
    ).toBe(0)
  })
})

describe('INV-32 — teto de 30% do bruto', () => {
  it('não corta quando a soma cabe no teto', () => {
    const r = calcularDescontos({ vlrBruto: 1000 })
    expect(r.tetoDesconto).toBe(300)
    expect(r.tetoAcionado).toBe(false)
    expect(r.itens.every((i) => !i.cortadoPeloTeto)).toBe(true)
  })

  it('corta o excesso e para exatamente no teto', () => {
    const r = calcularDescontos({
      vlrBruto: 1000,
      lancamentos: [
        { tipoDesconto: TIPO_DESCONTO.JUDICIAL, vlrDesconto: 500, pctDesconto: null },
        { tipoDesconto: TIPO_DESCONTO.PENSAO_ALIMENTICIA, vlrDesconto: null, pctDesconto: 20 },
      ],
    })

    expect(r.tetoAcionado).toBe(true)
    expect(r.vlrDescontoTotal).toBe(300) // exatamente 30% de 1000
    expect(r.vlrLiquido).toBe(700)
    expect(r.tetoImpossivel).toBe(false)
  })

  it('corta na ordem adotada: sindical antes de judicial, preservando pensão', () => {
    const r = calcularDescontos({
      vlrBruto: 1000,
      lancamentos: [
        { tipoDesconto: TIPO_DESCONTO.JUDICIAL, vlrDesconto: 500, pctDesconto: null },
        { tipoDesconto: TIPO_DESCONTO.PENSAO_ALIMENTICIA, vlrDesconto: null, pctDesconto: 20 },
      ],
    })

    const porTipo = Object.fromEntries(r.itens.map((i) => [i.tipo, i]))
    // Total pedido: 30 + 10 + 500 + 200 = 740. Teto: 300. Excesso: 440.
    // Corta AD (não existe) → SI (10, zera) → JU (430 dos 500, sobram 70).
    expect(porTipo.SI!.valorAplicado).toBe(0)
    expect(porTipo.JU!.valorAplicado).toBe(70)
    // Preservados por serem obrigação legal:
    expect(porTipo.PA!.valorAplicado).toBe(200)
    expect(porTipo.CS!.valorAplicado).toBe(30)
  })

  it('preserva o valor original ao lado do aplicado, para a tela mostrar o corte', () => {
    const r = calcularDescontos({
      vlrBruto: 1000,
      lancamentos: [
        { tipoDesconto: TIPO_DESCONTO.JUDICIAL, vlrDesconto: 500, pctDesconto: null },
      ],
    })
    const ju = r.itens.find((i) => i.tipo === TIPO_DESCONTO.JUDICIAL)!
    expect(ju.valorOriginal).toBe(500)
    expect(ju.valorAplicado).toBeLessThan(500)
    expect(ju.cortadoPeloTeto).toBe(true)
  })

  it('avisa que a ordem de corte é presumida — ponto 2, impacto alto', () => {
    const r = calcularDescontos({
      vlrBruto: 1000,
      lancamentos: [
        { tipoDesconto: TIPO_DESCONTO.JUDICIAL, vlrDesconto: 500, pctDesconto: null },
      ],
    })
    expect(r.presumidos.some((p) => p.includes('ordem de corte'))).toBe(true)
  })

  it('sinaliza tetoImpossivel quando o tipo lançado não está na ordem de corte', () => {
    const r = calcularDescontos({
      vlrBruto: 1000,
      lancamentos: [{ tipoDesconto: 'XX', vlrDesconto: 500, pctDesconto: null }],
    })
    // 'XX' não é cortável: mesmo zerando tudo o que a ordem cobre, sobra acima do teto.
    expect(r.tetoImpossivel).toBe(true)
    expect(r.vlrDescontoTotal).toBeGreaterThan(r.tetoDesconto)
  })

  it('a ordem de corte cobre os seis tipos conhecidos', () => {
    expect([...ORDEM_DE_CORTE].sort()).toEqual(Object.values(TIPO_DESCONTO).sort())
  })
})

describe('bruto zero', () => {
  it('não gera desconto nem líquido negativo', () => {
    const r = calcularDescontos({ vlrBruto: 0 })
    expect(r.itens).toHaveLength(0)
    expect(r.vlrDescontoTotal).toBe(0)
    expect(r.vlrLiquido).toBe(0)
  })
})

function emCentavosDeReais(v: number): number {
  return Math.round(v * 100)
}
