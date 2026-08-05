/**
 * Conciliação bancária e correção.  INV-34 a INV-36.
 */

import { arredondar2, emCentavos, emReais, percentualDeCentavos, truncar2 } from '@/lib/money'

/**
 * INV-35 — `#DIFF`, diferença de conciliação.
 * Rótulo: `Derivation of #DIFF — Conciliar Valores`.
 *
 * Positivo = o banco creditou a mais; negativo = a menos.
 * [PRESUMIDO] o sinal — o rótulo não diz a ordem da subtração. Adotado
 * conciliado − esperado, que é a leitura corrente em conciliação.
 */
export function diferencaConciliacao(
  vlrConciliado: number | null | undefined,
  vlrLiquido: number | null | undefined,
): number {
  return emReais(emCentavos(vlrConciliado) - emCentavos(vlrLiquido))
}

export function conciliado(
  vlrConciliado: number | null | undefined,
  vlrLiquido: number | null | undefined,
): boolean {
  return emCentavos(vlrConciliado) === emCentavos(vlrLiquido)
}

/**
 * INV-34 — `#VLR-CORR`, valor com correção aplicada.
 * Rótulo: `Derivation of #VLR-CORR — Aplicar Correcao` + `— Truncar`.
 *
 * O rótulo `— Truncar` é o que decide: **trunca**, não arredonda.
 */
export function aplicarCorrecao(valor: number, pctCorrecao: number): number {
  const centavos = emCentavos(valor)
  return emReais(centavos + percentualDeCentavos(centavos, pctCorrecao))
}

/**
 * INV-36 — `#VLR-ARR`.
 *
 * Rótulo de origem, na íntegra:
 *   `Derivation of #VLR-ARR — Nota: Arredondamento Difere Do Calcbenf (Round Vs Truncate)`
 *
 * Isto é uma nota que o **autor do código legado** deixou, avisando que este
 * caminho arredonda enquanto o cálculo do benefício trunca. É a divergência mais
 * valiosa recuperada da fonte inteira: está documentada no original, é
 * deliberada, e some se alguém "padronizar" o arredondamento.
 *
 * Reproduzida como está, de propósito. Ver `valorTruncado` logo abaixo para o
 * contraste — as duas funções existem separadas para que a diferença fique
 * testável, e um teste prova que elas divergem.
 */
export function valorArredondado(valor: number): number {
  return arredondar2(valor)
}

/** O caminho normal: trunca (INV-21). Contraste explícito com INV-36. */
export function valorTruncado(valor: number): number {
  return truncar2(valor)
}
