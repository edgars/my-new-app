/**
 * Idade e fator de idade.  INV-09, INV-10, INV-15, INV-16.
 */

import { anoDeAnoMes, anoDeYyyymmdd } from '@/lib/dates'

/** Limite de INV-10 (FR-19, `#IDADE > 75`). */
export const IDADE_LIMITE_ALERTA = 75

/**
 * INV-09 — `#ANO-ATUAL - #ANO-NASC` (FR-17).
 *
 * A conta é ano menos ano, sem olhar mês nem dia. **Isso é fiel à fonte**, não
 * um descuido: quem faz 76 anos em dezembro já conta como 76 desde janeiro.
 * Corrigir para idade civil exata mudaria silenciosamente quem cruza o limite
 * de INV-10 e quem entra em idadeMin / idadeMax do programa.
 */
export function calcularIdade(
  dtNascimento: number | null | undefined,
  anoAtual: number,
): number | null {
  const anoNasc = anoDeYyyymmdd(dtNascimento)
  if (anoNasc == null) return null
  return anoAtual - anoNasc
}

/**
 * Idade na competência de um pagamento (`anoMesRef`, AAAAMM).
 * Mesma conta de INV-09, com o ano vindo da competência em vez do relógio —
 * é o que `Calc Idade Benef` faz ao processar um ciclo retroativo.
 */
export function calcularIdadeNaCompetencia(
  dtNascimento: number | null | undefined,
  anoMesRef: number | null | undefined,
): number | null {
  const ano = anoDeAnoMes(anoMesRef)
  if (ano == null) return null
  return calcularIdade(dtNascimento, ano)
}

/** INV-10 — `#IDADE > 75`. Aviso, não bloqueio. Ver divergência D-05. */
export function idadeAcimaDoLimite(idade: number | null): boolean {
  return idade != null && idade > IDADE_LIMITE_ALERTA
}

export interface FatorIdade {
  fator: number
  /** true enquanto a curva real não vier do negócio. */
  presumido: boolean
}

/**
 * INV-16 — `#FATOR-IDADE`.
 *
 * A fonte preserva **que** o fator existe e **que** ele deriva da idade
 * (`Derivation of #ANO-NASC — Calc Fator Idade`, `Age calculation (#ANO -
 * #ANO-NASC) — Calc Fator Idade`). Não preserva a curva: nenhuma faixa, nenhum
 * multiplicador, nenhum ponto de corte aparece em qualquer artefato.
 *
 * [PRESUMIDO] — devolve o **elemento neutro** (1.0) de propósito.
 *
 * Inventar uma curva plausível aqui seria pior do que não ter: o cálculo pareceria
 * correto e pagaria valores errados sem nenhum sinal. Com o neutro, VLR-BENF fica
 * igual a `base × FATOR-RND`, que é rastreável e obviamente incompleto.
 *
 * Ponto a confirmar nº 3 em docs/build/01-invariants.md — impacto ALTO, muda o
 * valor pago. Bloqueia homologação do cálculo.
 */
export function calcularFatorIdade(_idade: number | null): FatorIdade {
  return { fator: 1, presumido: true }
}

export interface FatorRnd {
  fator: number
  presumido: boolean
}

/**
 * INV-17 — `#FATOR-RND`, o segundo multiplicador de
 * `Derivation of #VLR-BENF — #Fator-Rnd * #Fator-Idade`.
 *
 * [PRESUMIDO] — o nome sugere arredondamento, mas nenhum artefato diz de onde o
 * valor sai: pode ser fator regional, de renda, ou de arredondamento. Mesma
 * decisão de calcularFatorIdade: elemento neutro, marcado.
 *
 * Ponto a confirmar nº 4 em docs/build/01-invariants.md — impacto ALTO.
 */
export function calcularFatorRnd(): FatorRnd {
  return { fator: 1, presumido: true }
}
