import { describe, expect, it } from 'vitest'

import { digitoVerificador, formatarCpf, normalizarCpf, validarCpf } from '@/server/domain/cpf'

/**
 * INV-11 a INV-14. Bloco de maior fidelidade: docs/prd.md preservou as
 * expressões literais (FR-22 a FR-31), não só rótulos.
 */

describe('INV-12/INV-13 — resto módulo 11 e o dígito que sai dele', () => {
  it('usa divisão inteira, como o NATURAL faz em campo inteiro', () => {
    // FR-23: `#SOMA - ((#SOMA / 11) * 11)`.
    // Com divisão de ponto flutuante a expressão daria sempre 0 e todo CPF passaria.
    const soma = 54
    expect(soma - (soma / 11) * 11).toBeCloseTo(0) // o erro que se evita
    expect(soma - Math.trunc(soma / 11) * 11).toBe(10) // o resto de verdade
  })

  it('FR-24/FR-25 — resto < 2 vira dígito 0; senão 11 - resto', () => {
    expect(digitoVerificador(11)).toBe(0) // resto 0
    expect(digitoVerificador(12)).toBe(0) // resto 1
    expect(digitoVerificador(13)).toBe(9) // resto 2 → 11-2
    expect(digitoVerificador(54)).toBe(1) // resto 10 → 11-10
  })
})

describe('INV-14 — validação completa', () => {
  it('aceita CPFs válidos', () => {
    for (const cpf of ['11144477735', '52998224725', '12345678909']) {
      expect(validarCpf(cpf), cpf).toMatchObject({ valido: true })
    }
  })

  it('aceita com pontuação', () => {
    expect(validarCpf('111.444.777-35')).toMatchObject({ valido: true })
    expect(validarCpf('529.982.247-25')).toMatchObject({ valido: true })
  })

  it('rejeita quando o primeiro dígito verificador não confere (FR-26)', () => {
    expect(validarCpf('11144477725')).toMatchObject({ valido: false, motivo: 'DV1' })
  })

  it('rejeita quando o segundo dígito verificador não confere (FR-31)', () => {
    expect(validarCpf('11144477734')).toMatchObject({ valido: false, motivo: 'DV2' })
  })

  it('rejeita comprimento diferente de 11', () => {
    expect(validarCpf('1114447773')).toMatchObject({ valido: false, motivo: 'FORMATO' })
    expect(validarCpf('')).toMatchObject({ valido: false, motivo: 'FORMATO' })
    expect(validarCpf(null)).toMatchObject({ valido: false, motivo: 'FORMATO' })
  })
})

describe('os CPFs que passam num mod-11 ingênuo', () => {
  // Estes são o motivo de o teste existir: um mod-11 correto os aceita.
  it('00000000000 passa no mod-11 mas é barrado por INV-02 (FR-10)', () => {
    // Prova de que o algoritmo puro o aceitaria:
    expect(digitoVerificador(0)).toBe(0)
    // E de que a validação completa o barra assim mesmo:
    expect(validarCpf('00000000000')).toMatchObject({ valido: false, motivo: 'ZERO' })
  })

  it('11111111111 passa no mod-11 — o legado o aceitava', () => {
    // Sem a checagem NOVO, este CPF é considerado válido.
    expect(validarCpf('11111111111', { rejeitarRepetidos: false })).toMatchObject({
      valido: true,
    })
  })

  it('NOVO — a checagem de dígitos repetidos o rejeita por padrão', () => {
    expect(validarCpf('11111111111')).toMatchObject({
      valido: false,
      motivo: 'DIGITOS_REPETIDOS',
    })
    for (const d of '23456789') {
      expect(validarCpf(d.repeat(11)), d.repeat(11)).toMatchObject({ valido: false })
    }
  })
})

describe('normalização e formatação', () => {
  it('remove pontuação', () => {
    expect(normalizarCpf('111.444.777-35')).toBe('11144477735')
    expect(normalizarCpf(11144477735)).toBe('11144477735')
    expect(normalizarCpf(null)).toBe('')
  })

  it('formata para exibição', () => {
    expect(formatarCpf('11144477735')).toBe('111.444.777-35')
  })

  it('devolve a entrada limpa quando não dá para formatar', () => {
    expect(formatarCpf('123')).toBe('123')
  })
})
