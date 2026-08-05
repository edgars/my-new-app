/**
 * CPF — dígito verificador módulo 11.  INV-11 a INV-14.
 *
 * Este é o bloco de maior fidelidade recuperado da fonte: docs/prd.md preservou
 * as expressões literais, não só o rótulo.
 *
 *   FR-22 / FR-27  soma ponderada        `#SOMA + (#DIG(#I) * #PESO)`
 *   FR-23 / FR-28  resto módulo 11       `#SOMA - ((#SOMA / 11) * 11)`
 *   FR-24 / FR-29  resto < 2             `#RESTO < 2`
 *   FR-25 / FR-30  dígito                `11 - #RESTO`
 *   FR-26          confere DV1           `#DV1 NE #DIG(10)`
 *   FR-31          confere DV2           `#DV2 NE #DIG(11)`
 *
 * `#DIG` é 1-indexado no NATURAL: DIG(10) é o primeiro verificador, DIG(11) o segundo.
 */

/**
 * [PRESUMIDO] Os pesos.
 *
 * docs/prd.md preserva `#PESO` como símbolo, nunca seus valores. A sequência
 * abaixo é a do algoritmo oficial de CPF, e é a única compatível com todo o
 * resto que a fonte preservou (11 dígitos, módulo 11, DIG(10) e DIG(11)).
 * Confiança alta, mas é leitura adotada, não extração.
 * Ver docs/build/01-invariants.md, seção B.
 */
const PESOS_DV1 = [10, 9, 8, 7, 6, 5, 4, 3, 2] as const
const PESOS_DV2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2] as const

export type ResultadoCpf =
  | { valido: true; digitos: readonly number[] }
  | { valido: false; motivo: MotivoCpfInvalido }

export type MotivoCpfInvalido =
  | 'FORMATO'
  | 'ZERO'
  | 'DIGITOS_REPETIDOS'
  | 'DV1'
  | 'DV2'

/** Remove pontuação. Aceita '123.456.789-09' e '12345678909'. */
export function normalizarCpf(entrada: string | number | null | undefined): string {
  if (entrada == null) return ''
  return String(entrada).replace(/\D/g, '')
}

/**
 * INV-12 e INV-13 — resto módulo 11 e o dígito que sai dele.
 *
 * `#SOMA / 11` em NATURAL sobre campo inteiro é divisão **inteira**. Por isso
 * Math.trunc, e não divisão de ponto flutuante: com `/` puro a expressão
 * `#SOMA - ((#SOMA / 11) * 11)` daria sempre zero.
 */
export function digitoVerificador(soma: number): number {
  const resto = soma - Math.trunc(soma / 11) * 11
  return resto < 2 ? 0 : 11 - resto
}

/** INV-11 — soma ponderada `#SOMA + (#DIG(#I) * #PESO)`. */
function somaPonderada(digitos: readonly number[], pesos: readonly number[]): number {
  let soma = 0
  for (let i = 0; i < pesos.length; i++) {
    soma += digitos[i]! * pesos[i]!
  }
  return soma
}

export interface OpcoesCpf {
  /**
   * NOVO — não existe na fonte.
   *
   * CPFs de dígito repetido (11111111111, 22222222222, …) **passam** no módulo 11:
   * para 11111111111 a soma dá 54, resto 10, DV 1 — que bate com DIG(10). O legado
   * os aceitava. Num sistema de benefício por CPF isso é porta aberta para cadastro
   * fantasma, então a checagem entra ligada por padrão.
   *
   * É mudança de comportamento em relação ao original, e está listada como tal na
   * auditoria de proveniência. Passe `false` para reproduzir o legado exatamente.
   *
   * O caso 00000000000 não depende disto: INV-02 (FR-10, `#CPF = 0`) já o barra.
   */
  rejeitarRepetidos?: boolean
}

/** INV-14 — valida um CPF completo. */
export function validarCpf(
  entrada: string | number | null | undefined,
  opcoes: OpcoesCpf = {},
): ResultadoCpf {
  const { rejeitarRepetidos = true } = opcoes
  const limpo = normalizarCpf(entrada)

  if (limpo.length !== 11) return { valido: false, motivo: 'FORMATO' }

  const digitos = [...limpo].map(Number)

  // INV-02 / FR-10 — `#CPF = 0`.
  if (digitos.every((d) => d === 0)) return { valido: false, motivo: 'ZERO' }

  if (rejeitarRepetidos && digitos.every((d) => d === digitos[0])) {
    return { valido: false, motivo: 'DIGITOS_REPETIDOS' }
  }

  // FR-26 — `#DV1 NE #DIG(10)`. DIG(10) é o índice 9 em base zero.
  const dv1 = digitoVerificador(somaPonderada(digitos, PESOS_DV1))
  if (dv1 !== digitos[9]) return { valido: false, motivo: 'DV1' }

  // FR-31 — `#DV2 NE #DIG(11)`. DIG(11) é o índice 10 em base zero.
  const dv2 = digitoVerificador(somaPonderada(digitos, PESOS_DV2))
  if (dv2 !== digitos[10]) return { valido: false, motivo: 'DV2' }

  return { valido: true, digitos }
}

/** Açúcar para uso em validação: só o booleano. */
export function cpfValido(
  entrada: string | number | null | undefined,
  opcoes?: OpcoesCpf,
): boolean {
  return validarCpf(entrada, opcoes).valido
}

/** Formata 11 dígitos como 000.000.000-00. Devolve a entrada se não der. */
export function formatarCpf(entrada: string | number | null | undefined): string {
  const limpo = normalizarCpf(entrada)
  if (limpo.length !== 11) return limpo
  return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-${limpo.slice(9)}`
}

export const MENSAGEM_CPF: Record<MotivoCpfInvalido, string> = {
  FORMATO: 'CPF deve ter 11 dígitos.',
  ZERO: 'CPF não pode ser zero.',
  DIGITOS_REPETIDOS: 'CPF com todos os dígitos iguais não é válido.',
  DV1: 'CPF inválido: primeiro dígito verificador não confere.',
  DV2: 'CPF inválido: segundo dígito verificador não confere.',
}
