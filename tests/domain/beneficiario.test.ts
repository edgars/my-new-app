import { describe, expect, it } from 'vitest'

import {
  ehErroDeUnicidade,
  validarBeneficiario,
  validarOper,
  verificarRegraDeOperacao,
} from '@/server/domain/beneficiario'
import { calcularIdade, idadeAcimaDoLimite, IDADE_LIMITE_ALERTA } from '@/server/domain/idade'
import { OPER, transicaoPermitida, TRANSICOES_BENEFICIARIO, SIT_BENEFICIARIO } from '@/server/domain/status'

const valido = {
  numCpf: '11144477735',
  nomeCompleto: 'Maria da Silva',
  dtNascimento: 19850312,
  sexo: 'F',
}

const ctx = { anoAtual: 2026 }

describe('validação completa — o caminho feliz', () => {
  it('aceita um beneficiário completo e correto', () => {
    const r = validarBeneficiario(valido, ctx)
    expect(r.ok).toBe(true)
    expect(r.erros).toHaveLength(0)
    expect(r.avisos).toHaveLength(0)
  })
})

describe('INV-02 / FR-10 — CPF zero', () => {
  it('rejeita CPF ausente', () => {
    const r = validarBeneficiario({ ...valido, numCpf: null }, ctx)
    expect(r.ok).toBe(false)
    expect(r.erros[0]).toMatchObject({ campo: 'numCpf', origem: 'FR-10' })
  })

  it('rejeita CPF todo zero', () => {
    const r = validarBeneficiario({ ...valido, numCpf: '00000000000' }, ctx)
    expect(r.erros.some((e) => e.origem === 'FR-10')).toBe(true)
  })
})

describe('INV-03 / FR-11 — CPF inválido', () => {
  it('rejeita dígito verificador errado', () => {
    const r = validarBeneficiario({ ...valido, numCpf: '11144477736' }, ctx)
    expect(r.ok).toBe(false)
    expect(r.erros.some((e) => e.origem === 'FR-11')).toBe(true)
  })

  it('marca a rejeição de dígitos repetidos como NOVO, não como FR-11', () => {
    // Honestidade de proveniência: o legado aceitava 11111111111.
    const r = validarBeneficiario({ ...valido, numCpf: '11111111111' }, ctx)
    expect(r.erros[0]!.origem).toContain('NOVO')
  })
})

describe('INV-04 / FR-12 — nome obrigatório', () => {
  it('rejeita nome vazio e nome só com espaço', () => {
    for (const nome of ['', '   ', null]) {
      const r = validarBeneficiario({ ...valido, nomeCompleto: nome }, ctx)
      expect(r.erros.some((e) => e.origem === 'FR-12'), String(nome)).toBe(true)
    }
  })

  it('contradiz a tabela de UI, que marcava nomeCompleto como opcional (D-02)', () => {
    const r = validarBeneficiario({ ...valido, nomeCompleto: null }, ctx)
    expect(r.ok).toBe(false)
  })
})

describe('INV-05 / FR-13 — data de nascimento obrigatória', () => {
  it('rejeita ausente e zero', () => {
    expect(validarBeneficiario({ ...valido, dtNascimento: null }, ctx).ok).toBe(false)
    expect(validarBeneficiario({ ...valido, dtNascimento: 0 }, ctx).ok).toBe(false)
  })

  it('rejeita data impossível', () => {
    const r = validarBeneficiario({ ...valido, dtNascimento: 20240231 }, ctx)
    expect(r.erros.some((e) => e.origem === 'FR-13')).toBe(true)
  })
})

describe("INV-06 / FR-14 — sexo deve ser 'M' ou 'F'", () => {
  it('aceita M e F, maiúsculo ou minúsculo', () => {
    for (const s of ['M', 'F', 'm', 'f']) {
      expect(validarBeneficiario({ ...valido, sexo: s }, ctx).ok, s).toBe(true)
    }
  })

  it('rejeita qualquer outro valor', () => {
    for (const s of ['X', '', null, 'MASCULINO']) {
      const r = validarBeneficiario({ ...valido, sexo: s }, ctx)
      expect(r.erros.some((e) => e.origem === 'FR-14'), String(s)).toBe(true)
    }
  })
})

describe('INV-09 / INV-10 — idade e o limite de 75', () => {
  it('FR-17 — a conta é ano menos ano, sem olhar mês nem dia', () => {
    // Fiel à fonte: quem nasceu em dezembro de 1950 já conta 76 em janeiro de 2026.
    expect(calcularIdade(19501231, 2026)).toBe(76)
    expect(calcularIdade(19500101, 2026)).toBe(76)
  })

  it('FR-19 — acima de 75 gera aviso, não erro', () => {
    const r = validarBeneficiario({ ...valido, dtNascimento: 19400312 }, ctx)
    expect(r.ok).toBe(true) // não bloqueia
    expect(r.avisos).toHaveLength(1)
    expect(r.avisos[0]).toMatchObject({ origem: 'FR-19', bloqueia: false })
  })

  it('exatamente 75 não dispara — a condição é `> 75`, não `>=`', () => {
    expect(idadeAcimaDoLimite(IDADE_LIMITE_ALERTA)).toBe(false)
    expect(idadeAcimaDoLimite(IDADE_LIMITE_ALERTA + 1)).toBe(true)
  })

  it('idade desconhecida não dispara o aviso', () => {
    expect(idadeAcimaDoLimite(null)).toBe(false)
  })
})

describe('INV-01 / FR-09 — operação deve ser I ou A', () => {
  it('aceita I e A', () => {
    expect(validarOper('I')).toBeNull()
    expect(validarOper('A')).toBeNull()
  })

  it('rejeita o resto', () => {
    for (const o of ['E', '', null, 'i']) {
      expect(validarOper(o), String(o)).toMatchObject({ origem: 'FR-09' })
    }
  })
})

describe('INV-07 / INV-08 — as duas regras que dependem do banco', () => {
  const leitorCom = (achou: boolean) => ({
    findUnique: async () => (achou ? { id: 1 } : null),
  })

  it('FR-15 — inclusão de CPF já existente é erro', async () => {
    const p = await verificarRegraDeOperacao(leitorCom(true), {
      oper: OPER.INCLUSAO,
      numCpf: '11144477735',
    })
    expect(p).toMatchObject({ origem: 'FR-15', bloqueia: true })
  })

  it('FR-15 — inclusão de CPF novo passa', async () => {
    const p = await verificarRegraDeOperacao(leitorCom(false), {
      oper: OPER.INCLUSAO,
      numCpf: '11144477735',
    })
    expect(p).toBeNull()
  })

  it('FR-16 — alteração de CPF inexistente é erro', async () => {
    const p = await verificarRegraDeOperacao(leitorCom(false), {
      oper: OPER.ALTERACAO,
      numCpf: '11144477735',
    })
    expect(p).toMatchObject({ origem: 'FR-16', bloqueia: true })
  })

  it('FR-16 — alteração de CPF existente passa', async () => {
    const p = await verificarRegraDeOperacao(leitorCom(true), {
      oper: OPER.ALTERACAO,
      numCpf: '11144477735',
    })
    expect(p).toBeNull()
  })
})

describe('D-04 — reconhecimento do erro de unicidade', () => {
  it('reconhece o P2002 do Prisma', () => {
    expect(ehErroDeUnicidade({ code: 'P2002' })).toBe(true)
  })

  it('reconhece a mensagem crua do SQLite', () => {
    expect(
      ehErroDeUnicidade(new Error('UNIQUE constraint failed: beneficiario.numCpf')),
    ).toBe(true)
  })

  it('não confunde com outro erro', () => {
    expect(ehErroDeUnicidade(new Error('disco cheio'))).toBe(false)
    expect(ehErroDeUnicidade(null)).toBe(false)
    expect(ehErroDeUnicidade({ code: 'P2025' })).toBe(false)
  })
})

describe('INV-37 — máquina de estado do beneficiário [PRESUMIDO]', () => {
  it('permite ativar um cadastrado', () => {
    expect(
      transicaoPermitida(
        TRANSICOES_BENEFICIARIO,
        SIT_BENEFICIARIO.CADASTRADO,
        SIT_BENEFICIARIO.ATIVO,
      ),
    ).toBe(true)
  })

  it('não permite sair de um estado terminal', () => {
    expect(
      transicaoPermitida(
        TRANSICOES_BENEFICIARIO,
        SIT_BENEFICIARIO.CANCELADO,
        SIT_BENEFICIARIO.ATIVO,
      ),
    ).toBe(false)
  })

  it('sem estado anterior é criação — libera', () => {
    expect(transicaoPermitida(TRANSICOES_BENEFICIARIO, null, SIT_BENEFICIARIO.ATIVO)).toBe(
      true,
    )
  })

  it('estado igual ao anterior é permitido — edição que não mexe na situação', () => {
    expect(
      transicaoPermitida(
        TRANSICOES_BENEFICIARIO,
        SIT_BENEFICIARIO.ATIVO,
        SIT_BENEFICIARIO.ATIVO,
      ),
    ).toBe(true)
  })
})

describe('múltiplos problemas de uma vez', () => {
  it('acumula todos os erros em vez de parar no primeiro', () => {
    const r = validarBeneficiario(
      { numCpf: null, nomeCompleto: '', dtNascimento: 0, sexo: 'X' },
      ctx,
    )
    expect(r.erros.map((e) => e.origem).sort()).toEqual([
      'FR-10',
      'FR-12',
      'FR-13',
      'FR-14',
    ])
  })
})
