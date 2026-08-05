import 'server-only'

import { headers } from 'next/headers'

import { agoraHhmmss, hojeYyyymmdd } from '@/lib/dates'
import { db } from '@/server/db/client'
import type { UsuarioAutenticado } from '@/server/auth/sessao'
import { COD_ACAO } from '@/server/domain/status'

/**
 * Escrita da trilha de auditoria.
 *
 * O que vem da fonte: as colunas de `Auditoria` (docs/architecture.md) e o campo
 * em que o legado ramificava (`DECIDE ON AUDITORIA-V.ACAO`).
 * [PRESUMIDO]: os valores de `codAcao` — ver docs/build/01-invariants.md.
 *
 * ⚠ Defeito herdado, registrado em docs/build/02-divergences.md S-03:
 * FR-04 exige CRUD completo sobre Auditoria, decidido pelo usuário em
 * 2026-08-02. Ou seja, o que esta função grava pode ser editado ou apagado pela
 * tela de Auditoria. A trilha não é append-only. Isso reproduz o legado; não o
 * corrige.
 */

export interface EventoAuditoria {
  codAcao: string
  codModulo: string
  desAcao: string
  tipoEntidade: string
  idEntidade?: string | number | null
  numCpfAfetado?: string | null
  idCorrelacao?: string | null
}

export async function registrarAuditoria(
  usuario: UsuarioAutenticado,
  evento: EventoAuditoria,
): Promise<void> {
  const agora = new Date()

  let ipOrigem: string | null = null
  try {
    const h = await headers()
    ipOrigem =
      h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? h.get('x-real-ip') ?? null
  } catch {
    // Fora de contexto de requisição (script, seed): sem IP, e tudo bem.
  }

  // A auditoria nunca derruba a operação que ela registra. Falha de trilha é
  // problema de observabilidade, não motivo para desfazer uma gravação válida.
  try {
    await db.auditoria.create({
      data: {
        dtEvento: hojeYyyymmdd(agora),
        hrEvento: agoraHhmmss(agora),
        tsEvento: agora.getTime(),
        codAcao: evento.codAcao,
        codModulo: evento.codModulo,
        desAcao: evento.desAcao,
        tipoEntidade: evento.tipoEntidade,
        idEntidade: evento.idEntidade != null ? String(evento.idEntidade) : null,
        numCpfAfetado: evento.numCpfAfetado ?? null,
        usrEvento: usuario.login,
        nomeUsuario: usuario.nome,
        codPerfil: usuario.codPerfil,
        codLotacao: usuario.codLotacao,
        ipOrigem,
        idSessao: usuario.idSessao,
        idCorrelacao: evento.idCorrelacao ?? null,
      },
    })
  } catch (erro) {
    console.error('[auditoria] falha ao registrar evento', evento, erro)
  }
}

export const ACAO = COD_ACAO
