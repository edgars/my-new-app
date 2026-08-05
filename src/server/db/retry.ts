/**
 * Retry de escrita sob contenção do SQLite.
 *
 * ── O problema, medido ──────────────────────────────────────────────────────
 *
 * `better-sqlite3` é **síncrono**. Quando duas escritas concorrem no mesmo
 * processo, a perdedora entra no `busy_timeout` do SQLite e bloqueia a thread do
 * Node inteira enquanto espera — o que impede a vencedora de terminar e
 * liberar a trava. As duas se estorvam até estourar o tempo.
 *
 * Saída real do diagnóstico, com duas conexões e busy_timeout de 2000 ms:
 *
 *   updates concorrentes: [
 *     {"status":"fulfilled","value":{"count":1}},
 *     {"status":"rejected","reason":{"code":"P1008", ...
 *       "originalCode":"SQLITE_BUSY","originalMessage":"database is locked"}}
 *   ]
 *
 * ── A correção ──────────────────────────────────────────────────────────────
 *
 * Inverter a estratégia de espera: `busy_timeout` **baixo**, para falhar rápido
 * em vez de travar a thread, e a espera acontece aqui, em JavaScript, com
 * `await`. O `await` devolve o event loop, a operação vencedora conclui e
 * commita, e a tentativa seguinte encontra o banco livre.
 *
 * Isto **não** é uma gambiarra de teste: um app Next.js roda em um processo, e
 * dois POST simultâneos batem exatamente nesta contenção.
 */

/** Códigos que significam "tenta de novo", não "deu errado". */
function ehContencao(erro: unknown): boolean {
  if (typeof erro !== 'object' || erro === null) return false

  const code = (erro as { code?: unknown }).code
  if (code === 'P1008' || code === 'SQLITE_BUSY') return true

  const texto = JSON.stringify(
    (erro as { meta?: unknown }).meta ?? (erro as { message?: unknown }).message ?? '',
  )
  return /SQLITE_BUSY|database is locked|database table is locked/i.test(texto)
}

export interface OpcoesRetry {
  tentativas?: number
  /** Espera base em ms; cresce linearmente com jitter a cada tentativa. */
  esperaBaseMs?: number
}

export async function comRetryDeEscrita<T>(
  fn: () => Promise<T>,
  opcoes: OpcoesRetry = {},
): Promise<T> {
  const tentativas = opcoes.tentativas ?? 8
  const esperaBaseMs = opcoes.esperaBaseMs ?? 15

  let ultimoErro: unknown
  for (let i = 0; i < tentativas; i++) {
    try {
      return await fn()
    } catch (erro) {
      if (!ehContencao(erro)) throw erro
      ultimoErro = erro
      // Jitter: sem ele, duas tentativas em fase colidem de novo no mesmo instante.
      const espera = esperaBaseMs * (i + 1) + Math.floor(Math.random() * esperaBaseMs)
      await new Promise((r) => setTimeout(r, espera))
    }
  }
  throw ultimoErro
}

export const _ehContencao = ehContencao
