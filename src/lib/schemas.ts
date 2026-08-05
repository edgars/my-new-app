import { z } from 'zod'

import { ehYyyymmddValida, inputParaYyyymmdd } from './dates'
import type { CampoSpec, EntidadeSpec } from './entidades'

/**
 * Schemas Zod derivados dos metadados da entidade.
 *
 * Nota de Zod 4: `z.coerce.*` tem entrada `unknown` e não aceita `.pipe()` vindo
 * de string. A normalização acontece em `z.preprocess`, que preserva a mensagem
 * de erro no campo certo em vez de jogá-la na raiz do formulário.
 */

/** '' e null viram undefined: campo em branco é "não informado", não zero. */
function vazioViraIndefinido(v: unknown): unknown {
  if (v === '' || v === null) return undefined
  return v
}

function numeroDe(v: unknown): unknown {
  const limpo = vazioViraIndefinido(v)
  if (limpo === undefined) return undefined
  if (typeof limpo === 'number') return limpo
  if (typeof limpo !== 'string') return limpo
  // Aceita tanto '1.234,56' quanto '1234.56'.
  const normalizado = limpo.trim().replace(/\s/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.')
  const n = Number(normalizado)
  return Number.isFinite(n) ? n : limpo
}

function dataDe(v: unknown): unknown {
  const limpo = vazioViraIndefinido(v)
  if (limpo === undefined) return undefined
  if (typeof limpo === 'number') return limpo
  if (typeof limpo !== 'string') return limpo
  // Do <input type="date"> vem 'YYYY-MM-DD'; da API pode vir 20240229 direto.
  if (/^\d{4}-\d{2}-\d{2}$/.test(limpo.trim())) return inputParaYyyymmdd(limpo) ?? limpo
  const n = Number(limpo)
  return Number.isFinite(n) ? n : limpo
}

function horaDe(v: unknown): unknown {
  const limpo = vazioViraIndefinido(v)
  if (limpo === undefined) return undefined
  if (typeof limpo === 'number') return limpo
  if (typeof limpo !== 'string') return limpo
  const m = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(limpo.trim())
  if (m) return Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3] ?? '0')
  const n = Number(limpo)
  return Number.isFinite(n) ? n : limpo
}

function textoDe(v: unknown): unknown {
  const limpo = vazioViraIndefinido(v)
  if (limpo === undefined) return undefined
  return typeof limpo === 'string' ? limpo.trim() : limpo
}

function cpfDe(v: unknown): unknown {
  const limpo = textoDe(v)
  if (limpo === undefined) return undefined
  return typeof limpo === 'string' ? limpo.replace(/\D/g, '') : limpo
}

function schemaDoCampo(campo: CampoSpec): z.ZodType {
  const obrigatorio = campo.obrigatorio

  switch (campo.componente) {
    case 'data': {
      const base = z
        .number({ error: 'Data inválida.' })
        .refine(ehYyyymmddValida, { message: 'Data inválida.' })
      return z.preprocess(dataDe, obrigatorio ? base : base.optional())
    }
    case 'hora': {
      const base = z
        .number({ error: 'Hora inválida.' })
        .int()
        .min(0)
        .max(235959, { message: 'Hora inválida.' })
      return z.preprocess(horaDe, obrigatorio ? base : base.optional())
    }
    case 'moeda': {
      const base = z.number({ error: 'Valor inválido.' }).min(0, 'Valor não pode ser negativo.')
      return z.preprocess(numeroDe, obrigatorio ? base : base.optional())
    }
    case 'percentual': {
      const base = z
        .number({ error: 'Percentual inválido.' })
        .min(0, 'Percentual não pode ser negativo.')
        .max(100, 'Percentual não pode passar de 100.')
      return z.preprocess(numeroDe, obrigatorio ? base : base.optional())
    }
    case 'identificador': {
      const base = z.number({ error: 'Número inválido.' }).int('Deve ser um número inteiro.')
      return z.preprocess(numeroDe, obrigatorio ? base : base.optional())
    }
    case 'numero': {
      const base = z.number({ error: 'Número inválido.' })
      return z.preprocess(numeroDe, obrigatorio ? base : base.optional())
    }
    case 'indicador': {
      const base = z.enum(['S', 'N'], { error: "Use 'S' ou 'N'." })
      return z.preprocess(
        (v) => {
          const t = textoDe(v)
          return typeof t === 'string' ? t.toUpperCase() : t
        },
        obrigatorio ? base : base.optional(),
      )
    }
    case 'cpf': {
      const base = z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos.')
      return z.preprocess(cpfDe, obrigatorio ? base : base.optional())
    }
    default: {
      const base = z.string().min(obrigatorio ? 1 : 0, 'Campo obrigatório.').max(500)
      return z.preprocess(textoDe, obrigatorio ? base : base.optional())
    }
  }
}

export function schemaDaEntidade(e: EntidadeSpec): z.ZodObject {
  const forma: Record<string, z.ZodType> = {}
  for (const campo of e.campos) forma[campo.nome] = schemaDoCampo(campo)

  if (e.pai) {
    forma[e.pai.campo] = z.preprocess(numeroDe, z.number().int().positive().optional())
  }

  // Trava otimista: só Beneficiario tem a coluna, e ela é FONTE, não invenção.
  if (e.modelo === 'beneficiario') {
    forma.numVersao = z.preprocess(numeroDe, z.number().optional())
  }

  return z.object(forma)
}

export const schemaDeBusca = z.object({
  q: z.string().trim().max(200).optional(),
  pagina: z.preprocess(numeroDe, z.number().int().min(1).default(1)),
  tamanho: z.preprocess(numeroDe, z.number().int().min(1).max(100).default(20)),
})

export type Busca = z.infer<typeof schemaDeBusca>

export const _internos = { numeroDe, dataDe, horaDe, textoDe, cpfDe }
