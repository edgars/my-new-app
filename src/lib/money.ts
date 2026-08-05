/**
 * Dinheiro em centavos inteiros.
 *
 * Por que existe (docs/build/02-divergences.md S-01):
 * docs/architecture.md tipa todo valor monetário como Float. IEEE-754 não
 * representa 0,1 exatamente. INV-21 exige truncamento em 2 casas no padrão
 * mainframe, e somar seis descontos em Float antes de truncar produz centavos
 * errados sem emitir erro nenhum.
 *
 * A coluna continua Float por fidelidade ao schema especificado. Toda a
 * aritmética acontece aqui, em inteiros, e só o resultado já truncado volta
 * para Float na borda de persistência.
 */

/** Tolerância para desfazer o erro de representação antes de truncar. */
const EPS = 1e-6

/**
 * Trunca para inteiro **em direção ao zero**, desfazendo antes o erro de
 * representação do ponto flutuante.
 *
 * Sem o snap, `Math.trunc(1234.56 * 100)` devolve 123455 — um centavo a menos —
 * porque o produto vale 123455.99999999999.
 */
export function truncarParaInteiro(x: number): number {
  if (!Number.isFinite(x)) throw new RangeError(`valor não finito: ${x}`)
  const proximo = Math.round(x)
  if (Math.abs(x - proximo) < EPS) return proximo
  return Math.trunc(x)
}

/**
 * Arredonda para inteiro **afastando-se do zero** no meio exato — a semântica
 * de ROUNDED do NATURAL.
 *
 * `Math.round` do JS arredonda em direção a +∞ (`Math.round(-0.5) === -0`),
 * o que diverge do legado para valores negativos.
 */
export function arredondarParaInteiro(x: number): number {
  if (!Number.isFinite(x)) throw new RangeError(`valor não finito: ${x}`)
  const sinal = x < 0 ? -1 : 1
  const abs = Math.abs(x)
  const proximo = Math.round(abs)
  if (Math.abs(abs - proximo) < EPS) return sinal * proximo
  return sinal * Math.floor(abs + 0.5)
}

/**
 * Converte um valor que **já está** em 2 casas (leitura do banco, entrada do
 * usuário) para centavos. Arredonda de propósito: o objetivo é desfazer o erro
 * de representação, não truncar casas que o valor não tem.
 */
export function emCentavos(reais: number | null | undefined): number {
  if (reais == null) return 0
  if (!Number.isFinite(reais)) throw new RangeError(`valor não finito: ${reais}`)
  return arredondarParaInteiro(reais * 100)
}

/** Converte centavos de volta para reais, para gravar na coluna Float. */
export function emReais(centavos: number): number {
  return centavos / 100
}

/**
 * INV-21 — trunca para 2 casas decimais. Padrão mainframe.
 * Rótulo de origem: `Derivation of #VLR-BENF — Truncar P/ 2 Casas Decimais - Padrao Mainframe`.
 */
export function truncar2(reais: number): number {
  return truncarParaInteiro(reais * 100) / 100
}

/**
 * INV-36 — arredonda para 2 casas decimais.
 *
 * Existe **separado** de truncar2 de propósito. O próprio código legado deixou a
 * nota: `Derivation of #VLR-ARR — Nota: Arredondamento Difere Do Calcbenf (Round
 * Vs Truncate)`. Um caminho arredonda enquanto todos os outros truncam.
 * Unificar os dois seria regressão silenciosa, não limpeza.
 */
export function arredondar2(reais: number): number {
  return arredondarParaInteiro(reais * 100) / 100
}

/**
 * Aplica um percentual sobre centavos, truncando (INV-21).
 * `pct` vem como número humano: 3 significa 3%.
 *
 * A multiplicação acontece antes da divisão para manter tudo inteiro o maior
 * tempo possível — `centavos * pct` é exato, `centavos * (pct/100)` não seria.
 */
export function percentualDeCentavos(centavos: number, pct: number): number {
  return truncarParaInteiro((centavos * pct) / 100)
}

/** Multiplica centavos por um fator decimal, truncando (INV-17, INV-20). */
export function multiplicarCentavos(centavos: number, fator: number): number {
  return truncarParaInteiro(centavos * fator)
}

/** Soma uma lista de centavos. Inteiro puro — não precisa truncar. */
export function somarCentavos(valores: readonly number[]): number {
  return valores.reduce((acc, v) => acc + v, 0)
}

/** Formata centavos como moeda brasileira, para exibição. */
export function formatarBRL(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100)
}
