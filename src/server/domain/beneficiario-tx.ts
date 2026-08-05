/**
 * Inserção e alteração de beneficiário contra o banco.
 *
 * Separado de `beneficiario.ts` (que é puro) porque estas funções dependem do
 * estado gravado: INV-07 e INV-08 só existem em relação ao que já existe.
 *
 * ── Sobre a corrida, e por que aqui não há transação interativa ──────────────
 *
 * O legado era desktop single-user: duas inclusões do mesmo CPF no mesmo
 * instante nunca aconteciam, e FR-15 nunca precisou ser defendida contra
 * corrida. Na web precisa desde o primeiro dia.
 *
 * A primeira versão desta camada fazia `SELECT` e depois `INSERT` dentro de
 * `db.$transaction(...)`. **Reprovou no teste de concorrência**, com timeout: o
 * Prisma abre a transação como DEFERRED, cada conexão concorrente adquire um
 * snapshot de leitura, e nenhuma consegue subir para escrita — o clássico
 * deadlock de upgrade do SQLite. Ler antes de escrever é justamente o padrão que
 * a corrida quebra.
 *
 * A correção não foi serializar mais: foi parar de ler antes de escrever. Cada
 * operação virou **um único statement atômico**, e a decisão fica com o banco:
 *
 *   inclusão   → INSERT direto; o UNIQUE de `numCpf` (D-04) decide quem ganhou.
 *   alteração  → UPDATE ... WHERE id = ? AND numVersao = ?; `count = 0` significa
 *                que outra pessoa alterou antes (trava otimista sobre a coluna
 *                `numVersao`, que o legado já tinha).
 *
 * Sem janela entre checar e agir, porque não há checagem separada.
 */

import type { PrismaClient } from '@/generated/prisma/client'
import { comRetryDeEscrita } from '@/server/db/retry'

import {
  ehErroDeUnicidade,
  validarBeneficiario,
  type DadosBeneficiario,
  type Problema,
} from './beneficiario'
import { normalizarCpf } from './cpf'
import { OPER } from './status'

export type ResultadoEscrita =
  | { ok: true; id: number; avisos: Problema[] }
  | { ok: false; problemas: Problema[] }

export interface DadosEscrita extends DadosBeneficiario {
  [campo: string]: unknown
}

const PROBLEMA_FR15: Problema = {
  campo: 'numCpf',
  mensagem: 'Já existe beneficiário com este CPF.',
  bloqueia: true,
  origem: 'FR-15',
}

const PROBLEMA_FR16: Problema = {
  campo: 'numCpf',
  mensagem: 'Não existe beneficiário com este CPF para alterar.',
  bloqueia: true,
  origem: 'FR-16',
}

const PROBLEMA_VERSAO: Problema = {
  campo: null,
  mensagem:
    'O registro foi alterado por outra pessoa enquanto você editava. Recarregue e tente de novo.',
  bloqueia: true,
  origem: 'NOVO (trava otimista sobre numVersao)',
}

/**
 * INV-07 / FR-15 — `#OPER = 'I' AND #FOUND` ⇒ erro.
 *
 * O INSERT vai direto. Não existe SELECT prévio de propósito: ele criaria a
 * janela entre checar e inserir que a corrida explora, e o índice UNIQUE já
 * responde a mesma pergunta sem janela nenhuma.
 */
export async function inserirBeneficiario(
  db: PrismaClient,
  dados: DadosEscrita,
  contexto: { anoAtual: number; usuario?: string },
): Promise<ResultadoEscrita> {
  const validacao = validarBeneficiario(dados, contexto)
  if (!validacao.ok) return { ok: false, problemas: validacao.erros }

  try {
    const criado = await comRetryDeEscrita(() =>
      db.beneficiario.create({
        data: {
          ...dados,
          numCpf: normalizarCpf(dados.numCpf),
          numVersao: 1,
          usrInclusao: contexto.usuario ?? null,
        } as never,
        select: { id: true },
      }),
    )
    return { ok: true, id: criado.id, avisos: validacao.avisos }
  } catch (erro) {
    if (ehErroDeUnicidade(erro)) return { ok: false, problemas: [PROBLEMA_FR15] }
    throw erro
  }
}

/**
 * INV-08 / FR-16 — `#OPER = 'A' AND NOT #FOUND` ⇒ erro.
 *
 * `updateMany` com a versão no WHERE é a trava otimista: duas edições
 * concorrentes do mesmo registro fazem a segunda casar zero linhas em vez de
 * sobrescrever a primeira em silêncio.
 *
 * Só quando `count = 0` é que se lê o banco — e aí a leitura é só para dar a
 * mensagem certa (não existe × versão velha). Nesse ponto já não há corrida a
 * perder: a escrita não aconteceu.
 */
export async function alterarBeneficiario(
  db: PrismaClient,
  id: number,
  dados: DadosEscrita,
  contexto: { anoAtual: number; usuario?: string; numVersao?: number | null },
): Promise<ResultadoEscrita> {
  const validacao = validarBeneficiario(dados, contexto)
  if (!validacao.ok) return { ok: false, problemas: validacao.erros }

  const where =
    contexto.numVersao != null
      ? { id, numVersao: contexto.numVersao }
      : { id }

  try {
    const r = await comRetryDeEscrita(() =>
      db.beneficiario.updateMany({
        where,
        data: {
          ...dados,
          numCpf: normalizarCpf(dados.numCpf),
          numVersao: { increment: 1 },
          usrUltAlteracao: contexto.usuario ?? null,
        } as never,
      }),
    )

    if (r.count > 0) return { ok: true, id, avisos: validacao.avisos }

    // Zero linhas: ou o registro não existe (FR-16), ou a versão envelheceu.
    const existe = await db.beneficiario.findUnique({ where: { id }, select: { id: true } })
    return { ok: false, problemas: [existe ? PROBLEMA_VERSAO : PROBLEMA_FR16] }
  } catch (erro) {
    if (ehErroDeUnicidade(erro)) return { ok: false, problemas: [PROBLEMA_FR15] }
    throw erro
  }
}

export const OPERACOES = OPER
