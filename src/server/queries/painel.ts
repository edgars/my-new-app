import 'server-only'

import { BENEFICIARIO, PAGAMENTO, PROGRAMA_SOCIAL, AUDITORIA } from '@/lib/entidades'
import { exigirUsuario } from '@/server/auth/sessao'
import { db } from '@/server/db/client'

/** Contagens do painel inicial. */
export async function contagens() {
  await exigirUsuario()

  const [programas, beneficiarios, pagamentos, auditorias] = await Promise.all([
    db.programaSocial.count(),
    db.beneficiario.count(),
    db.pagamento.count(),
    db.auditoria.count(),
  ])

  return [
    { titulo: PROGRAMA_SOCIAL.titulo, total: programas, rota: PROGRAMA_SOCIAL.rota },
    { titulo: BENEFICIARIO.titulo, total: beneficiarios, rota: BENEFICIARIO.rota },
    { titulo: PAGAMENTO.titulo, total: pagamentos, rota: PAGAMENTO.rota },
    { titulo: AUDITORIA.titulo, total: auditorias, rota: AUDITORIA.rota },
  ]
}
