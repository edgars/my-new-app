import { describe, expect, it } from 'vitest'

import {
  agoraHhmmss,
  anoDeAnoMes,
  anoDeYyyymmdd,
  diaDeYyyymmdd,
  ehYyyymmddValida,
  formatarData,
  formatarHora,
  hojeYyyymmdd,
  inputParaYyyymmdd,
  mesDeAnoMes,
  mesDeYyyymmdd,
  yyyymmddParaInput,
} from '@/lib/dates'

describe('INV-15 — derivação do ano a partir de YYYYMMDD', () => {
  it('extrai ano, mês e dia', () => {
    expect(anoDeYyyymmdd(19850312)).toBe(1985)
    expect(mesDeYyyymmdd(19850312)).toBe(3)
    expect(diaDeYyyymmdd(19850312)).toBe(12)
  })

  it('trata zero como ausente, não como ano 0', () => {
    // FR-13 usa `#DT-NASC = 0` para "não informado".
    expect(anoDeYyyymmdd(0)).toBeNull()
    expect(anoDeYyyymmdd(null)).toBeNull()
    expect(anoDeYyyymmdd(undefined)).toBeNull()
  })
})

describe('competência AAAAMM', () => {
  it('extrai ano e mês', () => {
    expect(anoDeAnoMes(202412)).toBe(2024)
    expect(mesDeAnoMes(202412)).toBe(12)
    expect(mesDeAnoMes(202401)).toBe(1)
  })

  it('trata zero como ausente', () => {
    expect(mesDeAnoMes(0)).toBeNull()
  })
})

describe('validação de YYYYMMDD', () => {
  it('aceita datas reais', () => {
    expect(ehYyyymmddValida(19850312)).toBe(true)
    expect(ehYyyymmddValida(20240229)).toBe(true) // bissexto
  })

  it('rejeita dias que não existem', () => {
    expect(ehYyyymmddValida(20240231)).toBe(false) // 31 de fevereiro
    expect(ehYyyymmddValida(20230229)).toBe(false) // 2023 não é bissexto
    expect(ehYyyymmddValida(20241301)).toBe(false) // mês 13
    expect(ehYyyymmddValida(20240100)).toBe(false) // dia 0
  })

  it('rejeita zero, nulo e não inteiro', () => {
    expect(ehYyyymmddValida(0)).toBe(false)
    expect(ehYyyymmddValida(null)).toBe(false)
    expect(ehYyyymmddValida(1985031.5)).toBe(false)
  })
})

describe('conversão para a borda de UI', () => {
  it('vai e volta sem perder valor', () => {
    expect(yyyymmddParaInput(19850312)).toBe('1985-03-12')
    expect(inputParaYyyymmdd('1985-03-12')).toBe(19850312)
    expect(inputParaYyyymmdd(yyyymmddParaInput(20240229))).toBe(20240229)
  })

  it('campo vazio vira null, não zero', () => {
    // Gravar 0 significaria "informado como zero"; null significa "não informado".
    expect(inputParaYyyymmdd('')).toBeNull()
    expect(inputParaYyyymmdd(null)).toBeNull()
    expect(inputParaYyyymmdd('data ruim')).toBeNull()
  })

  it('rejeita data impossível vinda do formulário', () => {
    expect(inputParaYyyymmdd('2024-02-31')).toBeNull()
  })

  it('data ausente vira string vazia no input', () => {
    expect(yyyymmddParaInput(0)).toBe('')
    expect(yyyymmddParaInput(null)).toBe('')
  })
})

describe('formatação para exibição', () => {
  it('formata data e hora', () => {
    expect(formatarData(19850312)).toBe('12/03/1985')
    expect(formatarHora(143005)).toBe('14:30:05')
    expect(formatarHora(5)).toBe('00:00:05')
  })

  it('data ausente não vira "00/00/0000"', () => {
    expect(formatarData(0)).toBe('')
    expect(formatarData(null)).toBe('')
  })
})

describe('carimbo de hoje', () => {
  it('produz YYYYMMDD e HHMMSS a partir de uma data fixa', () => {
    const d = new Date(2026, 7, 2, 14, 30, 5) // 02/08/2026 14:30:05 local
    expect(hojeYyyymmdd(d)).toBe(20260802)
    expect(agoraHhmmss(d)).toBe(143005)
  })
})
