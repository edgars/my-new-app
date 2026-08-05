/**
 * Datas e horas no formato mainframe.
 *
 * docs/architecture.md tipa dtNascimento, dtEvento, hrGeracao etc. como Float:
 * é o número YYYYMMDD / HHMMSS do NATURAL. Mantido assim (S-04) porque INV-15
 * depende literalmente disso — `ANO-NASC = trunc(dtNascimento / 10000)`.
 *
 * A conversão acontece só nas bordas: aqui.
 */

/** INV-15 — deriva o ano de uma data YYYYMMDD. */
export function anoDeYyyymmdd(yyyymmdd: number | null | undefined): number | null {
  if (yyyymmdd == null || yyyymmdd === 0) return null
  return Math.trunc(yyyymmdd / 10000)
}

export function mesDeYyyymmdd(yyyymmdd: number | null | undefined): number | null {
  if (yyyymmdd == null || yyyymmdd === 0) return null
  return Math.trunc(yyyymmdd / 100) % 100
}

export function diaDeYyyymmdd(yyyymmdd: number | null | undefined): number | null {
  if (yyyymmdd == null || yyyymmdd === 0) return null
  return yyyymmdd % 100
}

/** Mês de uma competência AAAAMM (`anoMesRef`). Usado por INV-24. */
export function mesDeAnoMes(anoMes: number | null | undefined): number | null {
  if (anoMes == null || anoMes === 0) return null
  return anoMes % 100
}

export function anoDeAnoMes(anoMes: number | null | undefined): number | null {
  if (anoMes == null || anoMes === 0) return null
  return Math.trunc(anoMes / 100)
}

/** Valida se o número é uma data YYYYMMDD plausível. Zero significa "ausente". */
export function ehYyyymmddValida(yyyymmdd: number | null | undefined): boolean {
  if (yyyymmdd == null || yyyymmdd === 0) return false
  if (!Number.isInteger(yyyymmdd)) return false
  if (yyyymmdd < 10000101 || yyyymmdd > 99991231) return false

  const ano = Math.trunc(yyyymmdd / 10000)
  const mes = Math.trunc(yyyymmdd / 100) % 100
  const dia = yyyymmdd % 100
  if (mes < 1 || mes > 12) return false
  if (dia < 1) return false

  // Construir em UTC e comparar de volta rejeita 31/02 sem tabela de dias por mês.
  const d = new Date(Date.UTC(ano, mes - 1, dia))
  return (
    d.getUTCFullYear() === ano && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia
  )
}

/** YYYYMMDD → 'YYYY-MM-DD', o formato que `<input type="date">` exige. */
export function yyyymmddParaInput(yyyymmdd: number | null | undefined): string {
  if (!ehYyyymmddValida(yyyymmdd)) return ''
  const s = String(yyyymmdd)
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

/** 'YYYY-MM-DD' → YYYYMMDD. String vazia vira null, não zero. */
export function inputParaYyyymmdd(valor: string | null | undefined): number | null {
  if (!valor) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor.trim())
  if (!m) return null
  const n = Number(`${m[1]}${m[2]}${m[3]}`)
  return ehYyyymmddValida(n) ? n : null
}

/** YYYYMMDD → 'DD/MM/YYYY', para exibição. */
export function formatarData(yyyymmdd: number | null | undefined): string {
  if (!ehYyyymmddValida(yyyymmdd)) return ''
  const s = String(yyyymmdd)
  return `${s.slice(6, 8)}/${s.slice(4, 6)}/${s.slice(0, 4)}`
}

/** HHMMSS → 'HH:MM:SS', para exibição. */
export function formatarHora(hhmmss: number | null | undefined): string {
  if (hhmmss == null) return ''
  const s = String(Math.trunc(hhmmss)).padStart(6, '0')
  return `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`
}

/** Data de hoje como YYYYMMDD, no fuso local. Usada para carimbar auditoria. */
export function hojeYyyymmdd(agora: Date = new Date()): number {
  const ano = agora.getFullYear()
  const mes = agora.getMonth() + 1
  const dia = agora.getDate()
  return ano * 10000 + mes * 100 + dia
}

/** Hora atual como HHMMSS, no fuso local. */
export function agoraHhmmss(agora: Date = new Date()): number {
  return agora.getHours() * 10000 + agora.getMinutes() * 100 + agora.getSeconds()
}
