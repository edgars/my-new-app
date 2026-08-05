import { describe, expect, it, vi } from 'vitest'

import { comRetryDeEscrita, _ehContencao } from '@/server/db/retry'

const busy = Object.assign(new Error('locked'), {
  code: 'P1008',
  meta: {
    driverAdapterError: {
      cause: { originalCode: 'SQLITE_BUSY', originalMessage: 'database is locked' },
    },
  },
})

describe('reconhecimento de contenção', () => {
  it('reconhece o P1008 do Prisma sobre SQLITE_BUSY', () => {
    expect(_ehContencao(busy)).toBe(true)
    expect(_ehContencao({ code: 'SQLITE_BUSY' })).toBe(true)
    expect(_ehContencao(new Error('database is locked'))).toBe(true)
  })

  it('não confunde com erro de negócio nem de constraint', () => {
    expect(_ehContencao({ code: 'P2002' })).toBe(false)
    expect(_ehContencao(new Error('disco cheio'))).toBe(false)
    expect(_ehContencao(null)).toBe(false)
  })
})

describe('retry de escrita', () => {
  it('devolve o valor na primeira tentativa quando não há contenção', async () => {
    const fn = vi.fn(async () => 'ok')
    expect(await comRetryDeEscrita(fn)).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('repete enquanto houver contenção e devolve o sucesso', async () => {
    let n = 0
    const fn = vi.fn(async () => {
      n++
      if (n < 3) throw busy
      return 'ok'
    })
    expect(await comRetryDeEscrita(fn, { esperaBaseMs: 1 })).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('propaga na hora um erro que não é contenção — não mascara bug', () => {
    const fn = vi.fn(async () => {
      throw new Error('coluna não existe')
    })
    return expect(comRetryDeEscrita(fn, { esperaBaseMs: 1 })).rejects.toThrow(
      'coluna não existe',
    )
  })

  it('desiste depois do número de tentativas e propaga o último erro', async () => {
    const fn = vi.fn(async () => {
      throw busy
    })
    await expect(
      comRetryDeEscrita(fn, { tentativas: 3, esperaBaseMs: 1 }),
    ).rejects.toMatchObject({ code: 'P1008' })
    expect(fn).toHaveBeenCalledTimes(3)
  })
})
