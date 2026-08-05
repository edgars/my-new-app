import { describe, expect, it } from 'vitest'

import {
  arredondar2,
  arredondarParaInteiro,
  emCentavos,
  emReais,
  formatarBRL,
  multiplicarCentavos,
  percentualDeCentavos,
  somarCentavos,
  truncar2,
  truncarParaInteiro,
} from '@/lib/money'

describe('S-01 — dinheiro em centavos inteiros', () => {
  it('converte para centavos sem perder o centavo que o Float engole', () => {
    // A armadilha inteira em uma linha: 4.35 * 100 === 434.99999999999994.
    // Nem todo valor sofre — 1234.56 * 100 dá exato — e é justamente por ser
    // intermitente que o bug passa despercebido em teste manual.
    expect(4.35 * 100).not.toBe(435)
    expect(Math.trunc(4.35 * 100)).toBe(434) // o que um trunc ingênuo faria
    expect(emCentavos(4.35)).toBe(435) // o que esta camada faz

    expect(8.2 * 100).not.toBe(820)
    expect(emCentavos(8.2)).toBe(820)
  })

  it('converte valores classicamente problemáticos', () => {
    expect(emCentavos(0.1)).toBe(10)
    expect(emCentavos(0.2)).toBe(20)
    expect(emCentavos(0.3)).toBe(30)
    expect(emCentavos(29.99)).toBe(2999)
    expect(emCentavos(1e6 + 0.07)).toBe(100000007)
  })

  it('soma em centavos não acumula erro que a soma em Float acumula', () => {
    const parcelas = Array.from({ length: 10 }, () => 0.1)
    const emFloat = parcelas.reduce((a, b) => a + b, 0)
    expect(emFloat).not.toBe(1) // 0.9999999999999999

    const total = somarCentavos(parcelas.map(emCentavos))
    expect(total).toBe(100)
    expect(emReais(total)).toBe(1)
  })

  it('trata nulo como zero', () => {
    expect(emCentavos(null)).toBe(0)
    expect(emCentavos(undefined)).toBe(0)
  })

  it('recusa valor não finito em vez de propagar NaN', () => {
    expect(() => emCentavos(Number.NaN)).toThrow(RangeError)
    expect(() => emCentavos(Number.POSITIVE_INFINITY)).toThrow(RangeError)
  })
})

describe('INV-21 × INV-36 — truncar não é arredondar', () => {
  // O código legado documenta, em rótulo próprio, que um caminho arredonda
  // enquanto os outros truncam. Este teste existe para que ninguém "padronize"
  // os dois sem perceber que quebrou fidelidade.
  it('divergem no mesmo valor de entrada', () => {
    expect(truncar2(10.999)).toBe(10.99)
    expect(arredondar2(10.999)).toBe(11)
    expect(truncar2(10.999)).not.toBe(arredondar2(10.999))
  })

  it('truncar sempre corta em direção ao zero', () => {
    expect(truncar2(5.678)).toBe(5.67)
    expect(truncar2(5.671)).toBe(5.67)
    expect(truncar2(-5.678)).toBe(-5.67)
  })

  it('arredondar afasta do zero no meio exato — ROUNDED do NATURAL', () => {
    expect(arredondar2(5.675)).toBe(5.68)
    expect(arredondar2(-5.675)).toBe(-5.68)
    // Math.round do JS erraria o negativo: Math.round(-567.5) === -567
    expect(Math.round(-567.5)).toBe(-567)
    expect(arredondarParaInteiro(-567.5)).toBe(-568)
  })

  it('truncar não come o centavo por erro de representação', () => {
    // 8.4 * 100 === 840.0000000000001; 4.35 * 100 === 434.99999999999994
    expect(truncar2(8.4)).toBe(8.4)
    expect(truncar2(4.35)).toBe(4.35)
    expect(truncarParaInteiro(4.35 * 100)).toBe(435)
  })
})

describe('percentual e multiplicação truncam (INV-21)', () => {
  it('3% de R$ 1.000,00 dá exatamente R$ 30,00', () => {
    expect(percentualDeCentavos(emCentavos(1000), 3)).toBe(3000)
  })

  it('trunca a fração de centavo em vez de arredondar', () => {
    // 3% de R$ 333,33 = R$ 9,9999 → trunca para R$ 9,99
    expect(percentualDeCentavos(emCentavos(333.33), 3)).toBe(999)
    expect(emReais(percentualDeCentavos(emCentavos(333.33), 3))).toBe(9.99)
  })

  it('multiplicar por fator decimal trunca', () => {
    expect(multiplicarCentavos(10000, 1.075)).toBe(10750)
    // 100.00 × 1.0333 = 103.33 exato; × 1.03335 = 103.335 → trunca
    expect(multiplicarCentavos(10000, 1.03335)).toBe(10333)
  })
})

describe('formatação', () => {
  it('formata em BRL', () => {
    //   é o espaço não separável que o Intl usa em pt-BR
    expect(formatarBRL(123456).replace(/ /g, ' ')).toBe('R$ 1.234,56')
  })
})
