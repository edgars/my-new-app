import { describe, expect, it } from 'vitest'

import { BENEFICIARIO, PROGRAMA_SOCIAL, colunasDaLista } from '@/lib/entidades'
import { schemaDaEntidade, schemaDeBusca } from '@/lib/schemas'

const benef = schemaDaEntidade(BENEFICIARIO)

describe('conversão de borda — formulário → banco', () => {
  it('converte data do <input type="date"> para o Float YYYYMMDD do mainframe', () => {
    const r = benef.parse({
      numCpf: '111.444.777-35',
      nomeCompleto: 'Maria',
      dtNascimento: '1985-03-12',
      sexo: 'F',
    })
    expect(r.dtNascimento).toBe(19850312)
  })

  it('tira a pontuação do CPF', () => {
    const r = benef.parse({
      numCpf: '111.444.777-35',
      nomeCompleto: 'Maria',
      dtNascimento: '1985-03-12',
      sexo: 'F',
    })
    expect(r.numCpf).toBe('11144477735')
  })

  it('campo em branco vira undefined, não zero', () => {
    // Gravar 0 em dtFimBenef significaria "encerrado em 00/00/0000".
    const r = benef.parse({
      numCpf: '11144477735',
      nomeCompleto: 'Maria',
      dtNascimento: '1985-03-12',
      sexo: 'F',
      dtFimBenef: '',
      telFixo: '',
    })
    expect(r.dtFimBenef).toBeUndefined()
    expect(r.telFixo).toBeUndefined()
  })

  it('rejeita data impossível vinda do formulário', () => {
    const r = benef.safeParse({
      numCpf: '11144477735',
      nomeCompleto: 'Maria',
      dtNascimento: '2024-02-31',
      sexo: 'F',
    })
    expect(r.success).toBe(false)
  })

  it('exige os 4 campos que FR-10 a FR-14 tornam obrigatórios (D-02)', () => {
    const r = benef.safeParse({})
    expect(r.success).toBe(false)
    const campos = r.success ? [] : r.error.issues.map((i) => i.path.join('.')).sort()
    expect(campos).toEqual(['dtNascimento', 'nomeCompleto', 'numCpf', 'sexo'])
  })

  it('aceita valor monetário em formato brasileiro e em ponto', () => {
    const prog = schemaDaEntidade(PROGRAMA_SOCIAL)
    expect(prog.parse({ codPrograma: 'X', vlrBaseIndividual: '1.234,56' }).vlrBaseIndividual).toBe(1234.56)
    expect(prog.parse({ codPrograma: 'X', vlrBaseIndividual: '1234.56' }).vlrBaseIndividual).toBe(1234.56)
  })

  it('recusa percentual acima de 100', () => {
    const prog = schemaDaEntidade(PROGRAMA_SOCIAL)
    expect(prog.safeParse({ codPrograma: 'X', pctReajusteAnual: '150' }).success).toBe(false)
  })

  it('normaliza indicador para maiúsculo e recusa fora de S/N', () => {
    const prog = schemaDaEntidade(PROGRAMA_SOCIAL)
    expect(prog.parse({ codPrograma: 'X', indExigeFilhos: 's' }).indExigeFilhos).toBe('S')
    expect(prog.safeParse({ codPrograma: 'X', indExigeFilhos: 'talvez' }).success).toBe(false)
  })

  it('converte hora HH:MM:SS para HHMMSS', () => {
    const r = benef.parse({
      numCpf: '11144477735',
      nomeCompleto: 'Maria',
      dtNascimento: '1985-03-12',
      sexo: 'F',
      hrInclusao: '14:30:05',
    })
    expect(r.hrInclusao).toBe(143005)
  })
})

describe('D-03 — listagem curada, não despejo de 45 colunas', () => {
  it('Beneficiário mostra 6 colunas na lista, não as 45 do formulário', () => {
    expect(BENEFICIARIO.campos.length).toBe(45)
    expect(colunasDaLista(BENEFICIARIO).map((c) => c.nome)).toEqual([
      'numInscricao', 'numCpf', 'nomeCompleto', 'dtNascimento', 'uf', 'sitBeneficiario',
    ])
  })
})

describe('S-06 — componente derivado do prefixo, não `input` para tudo', () => {
  it('reconhece data, moeda, percentual, indicador e CPF', () => {
    const por = Object.fromEntries(BENEFICIARIO.campos.map((c) => [c.nome, c.componente]))
    expect(por.dtNascimento).toBe('data')
    expect(por.hrInclusao).toBe('hora')
    expect(por.vlrRendaFamiliar).toBe('moeda')
    expect(por.numCpf).toBe('cpf')
    expect(por.indBiometria).toBe('indicador')
    expect(por.nomeCompleto).toBe('texto')
  })
})

describe('busca e paginação', () => {
  it('aplica padrões', () => {
    expect(schemaDeBusca.parse({})).toEqual({ pagina: 1, tamanho: 20 })
  })

  it('limita o tamanho da página', () => {
    expect(schemaDeBusca.safeParse({ tamanho: 5000 }).success).toBe(false)
  })
})
