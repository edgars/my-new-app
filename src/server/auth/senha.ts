import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCb) as (
  senha: string,
  sal: Buffer,
  tamanho: number,
) => Promise<Buffer>

const TAMANHO = 64
const SAL = 16

/**
 * NOVO — não existe na fonte. Ver docs/build/02-divergences.md S-05.
 *
 * scrypt do próprio Node: sem dependência nativa a mais, e com parâmetros de
 * custo que já são os recomendados por padrão.
 */
export async function gerarHashDeSenha(senha: string): Promise<string> {
  const sal = randomBytes(SAL)
  const derivada = await scrypt(senha, sal, TAMANHO)
  return `scrypt$${sal.toString('hex')}$${derivada.toString('hex')}`
}

export async function conferirSenha(senha: string, hash: string): Promise<boolean> {
  const [algoritmo, salHex, esperadoHex] = hash.split('$')
  if (algoritmo !== 'scrypt' || !salHex || !esperadoHex) return false

  const esperado = Buffer.from(esperadoHex, 'hex')
  const derivada = await scrypt(senha, Buffer.from(salHex, 'hex'), esperado.length)

  // Comparação em tempo constante: comparar com === vaza o prefixo correto
  // pelo tempo de resposta.
  return derivada.length === esperado.length && timingSafeEqual(derivada, esperado)
}
