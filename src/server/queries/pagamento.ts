import 'server-only'

import { exigirUsuario } from '@/server/auth/sessao'
import { db } from '@/server/db/client'
import { calcularBeneficio, type ResultadoBeneficio } from '@/server/domain/beneficio'
import { calcularDescontos, type ResultadoDescontos } from '@/server/domain/descontos'
import { diferencaConciliacao } from '@/server/domain/conciliacao'

/**
 * Leitura que alimenta o painel de cálculo do Pagamento.
 *
 * O motor (INV-17..33) vive em `src/server/domain/`. Aqui só se carregam os
 * parâmetros e se chama o domínio — nenhuma conta acontece nesta camada, e
 * nenhuma acontece no componente.
 */

export interface PainelCalculo {
  /** O que está **gravado** no registro. */
  gravado: {
    vlrBruto: number | null
    vlrDescontoTotal: number | null
    vlrLiquido: number | null
    vlrConciliado: number | null
  }
  /** O que o domínio **calcula** a partir dos parâmetros atuais. */
  descontos: ResultadoDescontos
  beneficio: ResultadoBeneficio | null
  /** INV-35 — diferença de conciliação, quando há valor conciliado. */
  diferencaConciliacao: number | null
  /** Divergência entre o gravado e o recalculado, em reais. */
  divergencias: { campo: string; gravado: number | null; calculado: number }[]
  presumidos: string[]
}

export async function painelDoPagamento(id: number): Promise<PainelCalculo | null> {
  await exigirUsuario()

  const pagamento = await db.pagamento.findUnique({
    where: { id },
    include: { descontos: true },
  })
  if (!pagamento) return null

  // --- descontos (INV-26..33) ---------------------------------------------
  // `incluirAutomaticos: false` porque contribuição social e sindical já estão
  // lançadas como linhas em PagamentoGrpDesconto; somá-las de novo dobraria.
  const descontos = calcularDescontos({
    vlrBruto: pagamento.vlrBruto ?? 0,
    lancamentos: pagamento.descontos.map((d) => ({
      tipoDesconto: d.tipoDesconto,
      vlrDesconto: d.vlrDesconto,
      pctDesconto: d.pctDesconto,
    })),
    incluirAutomaticos: false,
  })

  // --- benefício (INV-17..25) ----------------------------------------------
  // Depende de encontrar o programa e o beneficiário pelos códigos gravados no
  // pagamento. O legado não tem FK entre eles; o vínculo é por código.
  let beneficio: ResultadoBeneficio | null = null

  const programa = pagamento.codPrograma
    ? await db.programaSocial.findUnique({
        where: { codPrograma: pagamento.codPrograma },
        include: { faixasCalculo: true, paramsRegionais: true },
      })
    : null

  const beneficiario = pagamento.numCpf
    ? await db.beneficiario.findUnique({ where: { numCpf: pagamento.numCpf } })
    : null

  if (programa && beneficiario) {
    beneficio = calcularBeneficio({
      programa,
      beneficiario,
      faixas: programa.faixasCalculo,
      paramsRegionais: programa.paramsRegionais,
      anoMesRef: pagamento.anoMesRef,
    })
  }

  const divergencias: PainelCalculo['divergencias'] = []
  const compara = (campo: string, gravado: number | null, calculado: number) => {
    if (gravado == null) return
    if (Math.round(gravado * 100) !== Math.round(calculado * 100)) {
      divergencias.push({ campo, gravado, calculado })
    }
  }
  compara('vlrDescontoTotal', pagamento.vlrDescontoTotal, descontos.vlrDescontoTotal)
  compara('vlrLiquido', pagamento.vlrLiquido, descontos.vlrLiquido)
  if (beneficio) compara('vlrBruto', pagamento.vlrBruto, beneficio.vlrBruto)

  return {
    gravado: {
      vlrBruto: pagamento.vlrBruto,
      vlrDescontoTotal: pagamento.vlrDescontoTotal,
      vlrLiquido: pagamento.vlrLiquido,
      vlrConciliado: pagamento.vlrConciliado,
    },
    descontos,
    beneficio,
    diferencaConciliacao:
      pagamento.vlrConciliado != null
        ? diferencaConciliacao(pagamento.vlrConciliado, pagamento.vlrLiquido)
        : null,
    divergencias,
    presumidos: [...new Set([...(beneficio?.presumidos ?? []), ...descontos.presumidos])],
  }
}
