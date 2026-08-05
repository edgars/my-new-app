import { formatarData, formatarHora, yyyymmddParaInput } from './dates'
import type { CampoSpec } from './entidades'
import { formatarBRL, emCentavos } from './money'

/** Valor do banco → texto para a tabela. */
export function paraExibicao(campo: CampoSpec, valor: unknown): string {
  if (valor == null || valor === '') return '—'

  switch (campo.componente) {
    case 'data':
      return formatarData(Number(valor)) || '—'
    case 'hora':
      return formatarHora(Number(valor)) || '—'
    case 'moeda':
      return formatarBRL(emCentavos(Number(valor)))
    case 'percentual':
      return `${Number(valor).toLocaleString('pt-BR')}%`
    case 'cpf': {
      const s = String(valor).replace(/\D/g, '')
      return s.length === 11
        ? `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6, 9)}-${s.slice(9)}`
        : String(valor)
    }
    case 'indicador':
      return String(valor).toUpperCase() === 'S' ? 'Sim' : 'Não'
    case 'identificador':
      // Sem separador de milhar: identificador não é quantidade.
      return String(Math.trunc(Number(valor)))
    case 'numero':
      return Number(valor).toLocaleString('pt-BR')
    default:
      return String(valor)
  }
}

/** Valor do banco → value do input do formulário. */
export function paraInput(campo: CampoSpec, valor: unknown): string {
  if (valor == null) return ''

  switch (campo.componente) {
    case 'data':
      return yyyymmddParaInput(Number(valor))
    case 'hora': {
      const s = String(Math.trunc(Number(valor))).padStart(6, '0')
      return `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`
    }
    default:
      return String(valor)
  }
}

/** Tipo do <input> por componente. Ver S-06. */
export function tipoDoInput(campo: CampoSpec): string {
  switch (campo.componente) {
    case 'data':
      return 'date'
    case 'hora':
      return 'time'
    case 'moeda':
    case 'percentual':
    case 'numero':
    case 'identificador':
      return 'number'
    default:
      return 'text'
  }
}
