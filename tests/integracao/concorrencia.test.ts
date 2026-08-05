import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { alterarBeneficiario, inserirBeneficiario } from '@/server/domain/beneficiario-tx'
import type { PrismaClient } from '@/generated/prisma/client'

import { criarBancoDeTeste, type BancoDeTeste } from '../setup/db'

/**
 * Teste de concorrência — obrigatório no rigor "produção".
 *
 * Por que ele existe: o legado era desktop single-user. Duas inclusões do mesmo
 * CPF no mesmo instante nunca aconteciam lá, então a regra FR-15 nunca precisou
 * ser defendida contra corrida. Na web precisa, e desde o primeiro dia.
 *
 * Por que em arquivo e não em memória: SQLite em memória dá um banco por
 * conexão. O teste passaria sem nunca ter havido contenção — ou seja, passaria
 * provando nada.
 */

let banco: BancoDeTeste
let clientes: PrismaClient[]

const CPF = '11144477735'

const dados = {
  numCpf: CPF,
  nomeCompleto: 'Maria da Silva',
  dtNascimento: 19850312,
  sexo: 'F',
}

const ctx = { anoAtual: 2026, usuario: 'teste' }

beforeAll(() => {
  banco = criarBancoDeTeste()
  // Uma conexão por concorrente. Com um cliente só, better-sqlite3 é síncrono e
  // as "paralelas" seriam serializadas pelo próprio driver.
  clientes = Array.from({ length: 8 }, () => banco.novoCliente())
})

afterAll(() => {
  banco.destruir()
})

describe('FR-15 sob concorrência — inclusão do mesmo CPF em paralelo', () => {
  it('8 inserções simultâneas do mesmo CPF produzem exatamente 1 registro', async () => {
    const resultados = await Promise.all(
      clientes.map((c) => inserirBeneficiario(c, { ...dados }, ctx)),
    )

    const sucessos = resultados.filter((r) => r.ok)
    const falhas = resultados.filter((r) => !r.ok)

    expect(sucessos).toHaveLength(1)
    expect(falhas).toHaveLength(7)

    // Toda falha tem que ser a regra de negócio, não erro cru de banco vazando.
    for (const f of falhas) {
      expect(f.ok).toBe(false)
      if (!f.ok) expect(f.problemas[0]!.origem).toBe('FR-15')
    }

    // A prova que importa: o banco, não o valor de retorno.
    const total = await clientes[0]!.beneficiario.count({ where: { numCpf: CPF } })
    expect(total).toBe(1)
  })

  it('CPFs distintos em paralelo não brigam entre si', async () => {
    // Contraprova: o mecanismo não pode estar serializando tudo.
    const cpfs = [
      '52998224725',
      '12345678909',
      '39053344705',
      '16899535009',
      '11111111112',
    ]
    const validos = cpfs.slice(0, 4)

    const resultados = await Promise.all(
      validos.map((cpf, i) =>
        inserirBeneficiario(clientes[i]!, { ...dados, numCpf: cpf }, ctx),
      ),
    )

    expect(resultados.every((r) => r.ok)).toBe(true)
    const total = await clientes[0]!.beneficiario.count()
    expect(total).toBe(1 + validos.length)
  })
})

describe('trava otimista sobre numVersao — alterações concorrentes', () => {
  it('duas edições do mesmo registro: a segunda falha em vez de sobrescrever', async () => {
    const criado = await inserirBeneficiario(
      clientes[0]!,
      { ...dados, numCpf: '86288366757' },
      ctx,
    )
    expect(criado.ok).toBe(true)
    if (!criado.ok) return

    const versaoLida = 1

    const [a, b] = await Promise.all([
      alterarBeneficiario(
        clientes[1]!,
        criado.id,
        { ...dados, numCpf: '86288366757', nomeCompleto: 'Alteração A' },
        { ...ctx, numVersao: versaoLida },
      ),
      alterarBeneficiario(
        clientes[2]!,
        criado.id,
        { ...dados, numCpf: '86288366757', nomeCompleto: 'Alteração B' },
        { ...ctx, numVersao: versaoLida },
      ),
    ])

    const okCount = [a, b].filter((r) => r.ok).length
    expect(okCount).toBe(1)

    const perdedor = [a, b].find((r) => !r.ok)!
    expect(perdedor.ok).toBe(false)
    if (!perdedor.ok) {
      expect(perdedor.problemas[0]!.mensagem).toContain('alterado por outra pessoa')
    }

    // A versão avançou uma vez só — não duas.
    const reg = await clientes[0]!.beneficiario.findUnique({
      where: { id: criado.id },
      select: { numVersao: true, nomeCompleto: true },
    })
    expect(reg?.numVersao).toBe(2)
    // E o nome gravado é o do vencedor, não uma mistura.
    expect(['Alteração A', 'Alteração B']).toContain(reg?.nomeCompleto)
  })

  it('FR-16 — alterar registro inexistente é erro', async () => {
    const r = await alterarBeneficiario(clientes[0]!, 999999, { ...dados }, ctx)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.problemas[0]!.origem).toBe('FR-16')
  })
})

describe('D-04 — o índice UNIQUE é a rede final', () => {
  it('o banco recusa a duplicata mesmo quando o INSERT vem cru, sem passar pelo domínio', async () => {
    // Se alguém contornar a camada de domínio, o schema ainda segura.
    await expect(
      clientes[0]!.beneficiario.create({ data: { numCpf: CPF } }),
    ).rejects.toThrow()
  })
})
