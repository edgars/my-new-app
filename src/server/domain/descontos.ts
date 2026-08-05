/**
 * Descontos e valor líquido.  INV-26 a INV-33.
 *
 * Os percentuais desta seção são os de maior confiança entre as regras que
 * vieram só como rótulo: eles estavam escritos **dentro do texto do rótulo**.
 *
 *   INV-26  `Percentage calculation (3% of #VLR-BRUTO) — Desconto Basico - 3% Contrib Social`
 *   INV-27  `Percentage calculation (1% of #VLR-BRUTO) — Desconto Sindical`
 *   INV-32  `Percentage calculation (30% of #VLR-BRUTO) — Calc Teto Maximo Desconto - 30% Do Bruto`
 *
 * O que não veio: a ordem de aplicação e, principalmente, **qual desconto é
 * cortado** quando a soma estoura o teto. Ver INV-32 abaixo.
 */

import { emCentavos, emReais, percentualDeCentavos } from '@/lib/money'

/** INV-26 — contribuição social. Percentual literal no rótulo. */
export const PCT_CONTRIB_SOCIAL = 3

/** INV-27 — sindical. Percentual literal no rótulo. */
export const PCT_SINDICAL = 1

/** INV-32 — teto de desconto. Percentual literal no rótulo. */
export const PCT_TETO_DESCONTO = 30

/**
 * [PRESUMIDO] Códigos de tipo de desconto.
 *
 * O extrator preservou os **rótulos** dos cálculos, nunca os valores que
 * `tipoDesconto` assume no banco legado. Estes códigos são invenção desta build.
 * Ponto a confirmar nº 1 em docs/build/01-invariants.md — impacto alto.
 */
export const TIPO_DESCONTO = {
  CONTRIB_SOCIAL: 'CS',
  SINDICAL: 'SI',
  JUDICIAL: 'JU',
  PENSAO_ALIMENTICIA: 'PA',
  IMPOSTO_RETIDO: 'IR',
  ADMINISTRATIVO: 'AD',
} as const

export type TipoDesconto = (typeof TIPO_DESCONTO)[keyof typeof TIPO_DESCONTO]

export const ROTULO_DESCONTO: Record<TipoDesconto, string> = {
  CS: 'Contribuição social (3%)',
  SI: 'Sindical (1%)',
  JU: 'Judicial',
  PA: 'Pensão alimentícia',
  IR: 'Imposto retido',
  AD: 'Administrativo',
}

/**
 * [PRESUMIDO] Ordem de corte quando o teto de 30% é estourado — do primeiro a
 * ser cortado ao último.
 *
 * **A fonte não diz nada sobre isto.** Sabe-se que o teto existe (INV-32) e que
 * há seis tipos de desconto; não há um rótulo sequer sobre o que acontece quando
 * a soma passa de 30%.
 *
 * Leitura adotada: corta na ordem inversa da prioridade legal, preservando por
 * último pensão alimentícia, imposto retido e contribuição social — que são
 * obrigações legais, não descontos discricionários.
 *
 * Ponto a confirmar nº 2 em docs/build/01-invariants.md — **impacto ALTO,
 * muda o valor pago ao beneficiário.**
 */
export const ORDEM_DE_CORTE: readonly TipoDesconto[] = [
  TIPO_DESCONTO.ADMINISTRATIVO,
  TIPO_DESCONTO.SINDICAL,
  TIPO_DESCONTO.JUDICIAL,
  TIPO_DESCONTO.PENSAO_ALIMENTICIA,
  TIPO_DESCONTO.IMPOSTO_RETIDO,
  TIPO_DESCONTO.CONTRIB_SOCIAL,
]

export interface DescontoLancado {
  tipoDesconto: string | null
  /** Valor fixo em reais. INV-28: judicial pode ser fixo **ou** percentual. */
  vlrDesconto: number | null
  /** Percentual sobre VLR-BRUTO, como número humano (5 = 5%). */
  pctDesconto: number | null
}

export interface DescontoCalculado {
  tipo: string
  rotulo: string
  /** O que a regra pediu, antes do teto. */
  valorOriginal: number
  /** O que sobrou depois do teto de 30%. */
  valorAplicado: number
  cortadoPeloTeto: boolean
}

export interface ResultadoDescontos {
  itens: DescontoCalculado[]
  vlrDescontoTotal: number
  vlrLiquido: number
  tetoDesconto: number
  /** true quando o teto de 30% chegou a cortar alguma coisa. */
  tetoAcionado: boolean
  /**
   * true quando nem cortando tudo o que é cortável a soma cabe no teto —
   * só acontece se os descontos obrigatórios sozinhos passarem de 30%.
   */
  tetoImpossivel: boolean
  presumidos: string[]
}

/**
 * INV-28 a INV-31 — valor de um desconto lançado.
 *
 * Fixo tem precedência sobre percentual: o rótulo de INV-28 diz literalmente
 * "Valor Fixo Ou Percentual", nessa ordem.
 */
export function valorDoDescontoEmCentavos(
  d: DescontoLancado,
  brutoCentavos: number,
): number {
  if (d.vlrDesconto != null && d.vlrDesconto !== 0) return emCentavos(d.vlrDesconto)
  if (d.pctDesconto != null && d.pctDesconto !== 0) {
    return percentualDeCentavos(brutoCentavos, d.pctDesconto)
  }
  return 0
}

/**
 * INV-26, INV-27 — descontos automáticos que não vêm de lançamento.
 *
 * [PRESUMIDO] que sejam sempre aplicados. Os rótulos os descrevem como
 * "Desconto Basico", o que sugere automático, mas nenhuma condição foi extraída.
 */
export function descontosAutomaticos(brutoCentavos: number): DescontoLancado[] {
  return [
    {
      tipoDesconto: TIPO_DESCONTO.CONTRIB_SOCIAL,
      vlrDesconto: null,
      pctDesconto: PCT_CONTRIB_SOCIAL,
    },
    {
      tipoDesconto: TIPO_DESCONTO.SINDICAL,
      vlrDesconto: null,
      pctDesconto: PCT_SINDICAL,
    },
  ].filter(() => brutoCentavos > 0)
}

export interface EntradaDescontos {
  vlrBruto: number
  lancamentos?: readonly DescontoLancado[]
  /** Quando false, contribuição social e sindical não são somadas. */
  incluirAutomaticos?: boolean
}

export function calcularDescontos(entrada: EntradaDescontos): ResultadoDescontos {
  const { vlrBruto } = entrada
  const incluirAutomaticos = entrada.incluirAutomaticos ?? true
  const brutoCentavos = emCentavos(vlrBruto)
  const presumidos: string[] = []

  const lancamentos: DescontoLancado[] = [
    ...(incluirAutomaticos ? descontosAutomaticos(brutoCentavos) : []),
    ...(entrada.lancamentos ?? []),
  ]

  if (incluirAutomaticos && brutoCentavos > 0) {
    presumidos.push(
      'Contribuição social (3%) e sindical (1%) aplicadas automaticamente — a fonte não extraiu a condição.',
    )
  }

  // Valor bruto de cada desconto, antes do teto.
  const calculados = lancamentos.map((d) => {
    const tipo = d.tipoDesconto ?? '??'
    return {
      tipo,
      rotulo: ROTULO_DESCONTO[tipo as TipoDesconto] ?? tipo,
      centavosOriginal: valorDoDescontoEmCentavos(d, brutoCentavos),
      centavosAplicado: valorDoDescontoEmCentavos(d, brutoCentavos),
    }
  })

  // --- INV-32 — teto de 30% do bruto ---------------------------------------
  const tetoCentavos = percentualDeCentavos(brutoCentavos, PCT_TETO_DESCONTO)
  let somaCentavos = calculados.reduce((acc, c) => acc + c.centavosAplicado, 0)
  let tetoAcionado = false

  if (somaCentavos > tetoCentavos) {
    tetoAcionado = true
    presumidos.push(
      'Teto de 30% acionado. A ordem de corte é leitura adotada, não vem da fonte (ponto 2, impacto alto).',
    )

    let excesso = somaCentavos - tetoCentavos

    for (const tipo of ORDEM_DE_CORTE) {
      if (excesso <= 0) break
      for (const c of calculados) {
        if (excesso <= 0) break
        if (c.tipo !== tipo) continue
        const corte = Math.min(c.centavosAplicado, excesso)
        c.centavosAplicado -= corte
        excesso -= corte
      }
    }

    somaCentavos = calculados.reduce((acc, c) => acc + c.centavosAplicado, 0)
  }

  const tetoImpossivel = somaCentavos > tetoCentavos

  // --- INV-33 — VLR-LIQ = VLR-BRUTO − VLR-TOTAL-DSCT ------------------------
  const liquidoCentavos = brutoCentavos - somaCentavos

  return {
    itens: calculados.map((c) => ({
      tipo: c.tipo,
      rotulo: c.rotulo,
      valorOriginal: emReais(c.centavosOriginal),
      valorAplicado: emReais(c.centavosAplicado),
      cortadoPeloTeto: c.centavosAplicado < c.centavosOriginal,
    })),
    vlrDescontoTotal: emReais(somaCentavos),
    vlrLiquido: emReais(liquidoCentavos),
    tetoDesconto: emReais(tetoCentavos),
    tetoAcionado,
    tetoImpossivel,
    presumidos,
  }
}
