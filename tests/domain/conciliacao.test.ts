import { describe, expect, it } from 'vitest'

import {
  aplicarCorrecao,
  conciliado,
  diferencaConciliacao,
  valorArredondado,
  valorTruncado,
} from '@/server/domain/conciliacao'

describe('INV-35 — diferença de conciliação', () => {
  it('positiva quando o banco creditou a mais', () => {
    expect(diferencaConciliacao(1010, 1000)).toBe(10)
  })

  it('negativa quando creditou a menos', () => {
    expect(diferencaConciliacao(990, 1000)).toBe(-10)
  })

  it('zero quando bate', () => {
    expect(diferencaConciliacao(1000, 1000)).toBe(0)
    expect(conciliado(1000, 1000)).toBe(true)
  })

  it('compara em centavos, não em Float — diferença de um centavo é detectada', () => {
    expect(conciliado(1000.01, 1000)).toBe(false)
    expect(diferencaConciliacao(1000.01, 1000)).toBe(0.01)
  })

  it('trata ausente como zero', () => {
    expect(diferencaConciliacao(null, 1000)).toBe(-1000)
    expect(diferencaConciliacao(1000, null)).toBe(1000)
  })
})

describe('INV-34 — correção monetária', () => {
  it('aplica o percentual', () => {
    expect(aplicarCorrecao(1000, 10)).toBe(1100)
  })

  it('trunca a fração de centavo, como o rótulo `— Truncar` manda', () => {
    // 5% de 333,33 = 16,6665 → trunca para 16,66
    expect(aplicarCorrecao(333.33, 5)).toBe(349.99)
  })

  it('correção zero não altera o valor', () => {
    expect(aplicarCorrecao(1234.56, 0)).toBe(1234.56)
  })
})

describe('INV-36 — o caminho que arredonda em vez de truncar', () => {
  /**
   * A nota está no próprio rótulo do legado:
   *   `Derivation of #VLR-ARR — Nota: Arredondamento Difere Do Calcbenf (Round Vs Truncate)`
   *
   * Este teste existe para que a divergência não seja "limpa" por alguém que a
   * tome por inconsistência acidental. Ela é deliberada e documentada na fonte.
   */
  it('diverge do caminho que trunca, no mesmo valor', () => {
    expect(valorTruncado(10.999)).toBe(10.99)
    expect(valorArredondado(10.999)).toBe(11)
    expect(valorTruncado(10.999)).not.toBe(valorArredondado(10.999))
  })

  it('coincidem quando não há o que cortar — a divergência é só na fração', () => {
    expect(valorTruncado(10.5)).toBe(10.5)
    expect(valorArredondado(10.5)).toBe(10.5)
  })

  it('diverge também com valor negativo', () => {
    expect(valorTruncado(-10.999)).toBe(-10.99)
    expect(valorArredondado(-10.999)).toBe(-11)
  })
})
