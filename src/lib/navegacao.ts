import {
  Banknote,
  ClipboardList,
  Coins,
  FileSearch,
  LayoutDashboard,
  Map,
  Percent,
  Users,
  UserSquare2,
  type LucideIcon,
} from 'lucide-react'

import { AUDITORIA, BENEFICIARIO, DEPENDENTE, DESCONTO, FAIXA_CALCULO, PAGAMENTO, PARAM_REGIONAL, PROGRAMA_SOCIAL } from './entidades'

/**
 * Navegação agrupada por contexto de negócio.
 *
 * Os grupos são os mesmos bounded contexts da arquitetura (A1): Programa Social,
 * Beneficiário, Pagamento. Auditoria fica em Sistema por ser transversal.
 */

export interface ItemNav {
  titulo: string
  href: string
  icone: LucideIcon
}

export interface GrupoNav {
  titulo: string
  itens: ItemNav[]
}

export const NAVEGACAO: GrupoNav[] = [
  {
    titulo: 'Visão geral',
    itens: [{ titulo: 'Início', href: '/', icone: LayoutDashboard }],
  },
  {
    titulo: 'Programas',
    itens: [
      { titulo: PROGRAMA_SOCIAL.titulo, href: PROGRAMA_SOCIAL.rota, icone: ClipboardList },
      { titulo: FAIXA_CALCULO.titulo, href: FAIXA_CALCULO.rota, icone: Percent },
      { titulo: PARAM_REGIONAL.titulo, href: PARAM_REGIONAL.rota, icone: Map },
    ],
  },
  {
    titulo: 'Beneficiários',
    itens: [
      { titulo: BENEFICIARIO.titulo, href: BENEFICIARIO.rota, icone: Users },
      { titulo: DEPENDENTE.titulo, href: DEPENDENTE.rota, icone: UserSquare2 },
    ],
  },
  {
    titulo: 'Pagamentos',
    itens: [
      { titulo: PAGAMENTO.titulo, href: PAGAMENTO.rota, icone: Banknote },
      { titulo: DESCONTO.titulo, href: DESCONTO.rota, icone: Coins },
    ],
  },
  {
    titulo: 'Sistema',
    itens: [{ titulo: AUDITORIA.titulo, href: AUDITORIA.rota, icone: FileSearch }],
  },
]

/** Itens achatados, para o ⌘K. */
export const ITENS_NAV: ItemNav[] = NAVEGACAO.flatMap((g) => g.itens)
