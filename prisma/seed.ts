/**
 * Seed de desenvolvimento.
 *
 * Os CPFs são **gerados pelo próprio domínio** (digitoVerificador), não digitados
 * à mão. Seed com CPF inválido plantaria dado que a aplicação recusa, e o bug
 * apareceria só na primeira edição de um registro semeado.
 *
 * Os valores foram escolhidos para exercitar as invariantes que importam:
 * dezembro (13º e abono), programa tipo 'A' (abono de 15%), e um pagamento cuja
 * soma de descontos estoura o teto de 30%.
 */

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

import { PrismaClient } from '../src/generated/prisma/client'
import { gerarHashDeSenha } from '../src/server/auth/senha'
import { digitoVerificador } from '../src/server/domain/cpf'
import { TIPO_DESCONTO } from '../src/server/domain/descontos'
import { SIT_BENEFICIARIO, SIT_PAGAMENTO } from '../src/server/domain/status'

const PESOS_DV1 = [10, 9, 8, 7, 6, 5, 4, 3, 2]
const PESOS_DV2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]

/** Completa 9 dígitos com os dois verificadores, usando a função do domínio. */
function cpfCompleto(base9: string): string {
  const d = [...base9].map(Number)
  const dv1 = digitoVerificador(d.reduce((s, x, i) => s + x * PESOS_DV1[i]!, 0))
  const comDv1 = [...d, dv1]
  const dv2 = digitoVerificador(comDv1.reduce((s, x, i) => s + x * PESOS_DV2[i]!, 0))
  return `${base9}${dv1}${dv2}`
}

const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url, timeout: 50 }) })

async function main() {
  // Ordem inversa das dependências.
  await db.pagamentoGrpDesconto.deleteMany()
  await db.pagamento.deleteMany()
  await db.beneficiarioGrpDependente.deleteMany()
  await db.beneficiario.deleteMany()
  await db.programaSocialGrpFaixaCalculo.deleteMany()
  await db.programaSocialGrpParamRegional.deleteMany()
  await db.programaSocial.deleteMany()
  await db.sessao.deleteMany()
  await db.usuario.deleteMany()
  await db.auditoria.deleteMany()

  // --- usuários (NOVO — S-05) ---------------------------------------------
  await db.usuario.createMany({
    data: [
      {
        login: 'admin',
        nome: 'Administrador',
        senhaHash: await gerarHashDeSenha('admin123'),
        codPerfil: 'ADMIN',
        codLotacao: 'SEDE',
      },
      {
        login: 'operador',
        nome: 'Operador de Cadastro',
        senhaHash: await gerarHashDeSenha('oper123'),
        codPerfil: 'OPER',
        codLotacao: 'REG-NE',
      },
    ],
  })

  // --- programas -----------------------------------------------------------
  // Tipo 'A': o único que recebe abono natalino de 15% (INV-23).
  const bolsa = await db.programaSocial.create({
    data: {
      codPrograma: 'BF001',
      nomePrograma: 'Bolsa Família Municipal',
      siglaPrograma: 'BFM',
      tipoPrograma: 'A',
      orgaoResponsavel: 'Secretaria de Assistência Social',
      leiCriacao: 'Lei 12.345/2019',
      dtCriacao: 20190115,
      sitPrograma: 'AT',
      vlrBaseIndividual: 600,
      vlrBaseFamiliar: 900,
      vlrTetoBenef: 2500,
      vlrPisoBenef: 300,
      pctReajusteAnual: 4.5,
      dtUltReajuste: 20260101,
      fatorK: 1.2,
      rendaMaxPercap: 706,
      idadeMin: 0,
      idadeMax: 75,
      indExigeFilhos: 'S',
      qtdMinFilhos: 1,
      indExigeEscola: 'S',
      indExigeVacina: 'S',
      indExigePrenatal: 'N',
      indExigeBiometria: 'N',
      dtInclusao: 20190115,
      usrInclusao: 'admin',
      faixasCalculo: {
        create: [
          { rendaInicio: 0, rendaFim: 200, fatorMultiplicador: 1.5, vlrAdicional: 150, indAcumulativo: 'N' },
          { rendaInicio: 201, rendaFim: 500, fatorMultiplicador: 1.2, vlrAdicional: 80, indAcumulativo: 'N' },
          { rendaInicio: 501, rendaFim: 706, fatorMultiplicador: 1, vlrAdicional: 0, indAcumulativo: 'N' },
        ],
      },
      paramsRegionais: {
        create: [
          { codRegiao: 'NE', fatorRegional: 1.15, vlrComplementoReg: 120, indAtivoRegiao: 'S' },
          { codRegiao: 'NO', fatorRegional: 1.2, vlrComplementoReg: 150, indAtivoRegiao: 'S' },
          { codRegiao: 'SU', fatorRegional: 1, vlrComplementoReg: 0, indAtivoRegiao: 'N' },
        ],
      },
    },
  })

  // Tipo 'B': mesmo em dezembro, sem abono. Serve de contraprova a INV-23.
  await db.programaSocial.create({
    data: {
      codPrograma: 'AI002',
      nomePrograma: 'Auxílio Idoso',
      siglaPrograma: 'AID',
      tipoPrograma: 'B',
      orgaoResponsavel: 'Secretaria de Assistência Social',
      leiCriacao: 'Lei 13.100/2021',
      dtCriacao: 20210301,
      sitPrograma: 'AT',
      vlrBaseIndividual: 1200,
      vlrTetoBenef: 3000,
      vlrPisoBenef: 600,
      pctReajusteAnual: 3,
      idadeMin: 60,
      idadeMax: 120,
      indExigeFilhos: 'N',
      indExigeBiometria: 'S',
      dtInclusao: 20210301,
      usrInclusao: 'admin',
    },
  })

  // --- beneficiários -------------------------------------------------------
  const pessoas = [
    {
      base: '111444777',
      nome: 'Maria Aparecida da Silva',
      mae: 'Joana da Silva',
      nasc: 19850312,
      sexo: 'F',
      uf: 'PE',
      municipio: 'Recife',
      regiao: 'NE',
      renda: 480,
      membros: 4,
      situacao: SIT_BENEFICIARIO.ATIVO,
    },
    {
      base: '529982247',
      nome: 'João Carlos Pereira',
      mae: 'Rita Pereira',
      nasc: 19781120,
      sexo: 'M',
      uf: 'BA',
      municipio: 'Salvador',
      regiao: 'NE',
      renda: 900,
      membros: 3,
      situacao: SIT_BENEFICIARIO.ATIVO,
    },
    {
      base: '390533447',
      // Nascido em 1944: em 2026 tem 82 anos, acima do limite de INV-10.
      // Está aqui de propósito, para o aviso de FR-19 aparecer na tela.
      nome: 'Sebastião Alves de Souza',
      mae: 'Benedita Alves',
      nasc: 19440705,
      sexo: 'M',
      uf: 'AM',
      municipio: 'Manaus',
      regiao: 'NO',
      renda: 300,
      membros: 2,
      situacao: SIT_BENEFICIARIO.ATIVO,
    },
    {
      base: '168995350',
      nome: 'Ana Beatriz Costa',
      mae: 'Lúcia Costa',
      nasc: 19920228,
      sexo: 'F',
      uf: 'SP',
      municipio: 'Campinas',
      regiao: 'SU',
      renda: 1400,
      membros: 2,
      situacao: SIT_BENEFICIARIO.SUSPENSO,
    },
    {
      base: '862883667',
      nome: 'Carlos Eduardo Menezes',
      mae: 'Terezinha Menezes',
      nasc: 19660915,
      sexo: 'M',
      uf: 'CE',
      municipio: 'Fortaleza',
      regiao: 'NE',
      renda: 150,
      membros: 5,
      situacao: SIT_BENEFICIARIO.CADASTRADO,
    },
  ]

  const criados: { id: number; numCpf: string }[] = []
  for (const [i, p] of pessoas.entries()) {
    const numCpf = cpfCompleto(p.base)
    const b = await db.beneficiario.create({
      data: {
        numInscricao: 100001 + i,
        numCpf,
        nomeCompleto: p.nome,
        nomeMae: p.mae,
        dtNascimento: p.nasc,
        sexo: p.sexo,
        estCivil: 'S',
        logradouro: 'Rua das Flores',
        numero: String(100 + i * 7),
        bairro: 'Centro',
        municipio: p.municipio,
        uf: p.uf,
        cep: 50000000 + i * 111,
        codRegiao: p.regiao,
        codPrograma: bolsa.codPrograma,
        dtCadastro: 20240110 + i,
        dtInicioBenef: 20240201,
        sitBeneficiario: p.situacao,
        vlrRendaFamiliar: p.renda,
        qtdMembrosFamilia: p.membros,
        indRendaPercap: Math.trunc((p.renda / p.membros) * 100) / 100,
        telCelular: `8199${String(100000 + i)}`,
        email: `beneficiario${i + 1}@exemplo.gov.br`,
        indBiometria: i % 2 === 0 ? 'S' : 'N',
        dtInclusao: 20240110,
        hrInclusao: 90000,
        usrInclusao: 'admin',
        numVersao: 1,
      },
      select: { id: true, numCpf: true },
    })
    criados.push({ id: b.id, numCpf: b.numCpf! })
  }

  // --- dependentes ---------------------------------------------------------
  await db.beneficiarioGrpDependente.createMany({
    data: [
      {
        beneficiarioId: criados[0]!.id,
        cpfDependente: cpfCompleto('222333444'),
        nomeDependente: 'Pedro da Silva',
        dtNascDepend: 20120504,
        parentesco: 'FILHO',
        sitDependente: 'AT',
        indDeficiencia: 'N',
      },
      {
        beneficiarioId: criados[0]!.id,
        cpfDependente: cpfCompleto('333444555'),
        nomeDependente: 'Luiza da Silva',
        dtNascDepend: 20150819,
        parentesco: 'FILHO',
        sitDependente: 'AT',
        indDeficiencia: 'S',
      },
      {
        beneficiarioId: criados[4]!.id,
        cpfDependente: cpfCompleto('444555666'),
        nomeDependente: 'Marcos Menezes',
        dtNascDepend: 20101201,
        parentesco: 'FILHO',
        sitDependente: 'AT',
        indDeficiencia: 'N',
      },
    ],
  })

  // --- pagamentos ----------------------------------------------------------
  // Competência 202412: dezembro, para 13º (INV-24) e abono de 15% (INV-23).
  const pgtoDezembro = await db.pagamento.create({
    data: {
      numPagamento: 900001,
      numCpf: criados[0]!.numCpf,
      numInscricao: 100001,
      codPrograma: bolsa.codPrograma,
      anoMesRef: 202412,
      numCiclo: 12,
      vlrBruto: 2295,
      vlrDescontoTotal: 91.8,
      vlrLiquido: 2203.2,
      sitPagamento: SIT_PAGAMENTO.CONFIRMADO,
      dtGeracao: 20241205,
      hrGeracao: 30000,
      dtEmissao: 20241210,
      dtConfirmacao: 20241215,
      codBanco: '001',
      codAgencia: '1234',
      numConta: '567890',
      tipoConta: 'CC',
      dtInclusao: 20241205,
      usrInclusao: 'admin',
      descontos: {
        create: [
          { tipoDesconto: TIPO_DESCONTO.CONTRIB_SOCIAL, pctDesconto: 3, dtInicioDsct: 20240201 },
          { tipoDesconto: TIPO_DESCONTO.SINDICAL, pctDesconto: 1, dtInicioDsct: 20240201 },
        ],
      },
    },
  })

  // Competência 202406: junho, sem 13º nem abono. Contraprova de INV-24.
  await db.pagamento.create({
    data: {
      numPagamento: 900002,
      numCpf: criados[1]!.numCpf,
      numInscricao: 100002,
      codPrograma: bolsa.codPrograma,
      anoMesRef: 202406,
      numCiclo: 6,
      vlrBruto: 1080,
      vlrDescontoTotal: 43.2,
      vlrLiquido: 1036.8,
      sitPagamento: SIT_PAGAMENTO.CONCILIADO,
      dtGeracao: 20240605,
      dtEmissao: 20240610,
      dtConfirmacao: 20240615,
      dtConciliacao: 20240620,
      sitConciliacao: 'OK',
      vlrConciliado: 1036.8,
      codBanco: '104',
      codAgencia: '4321',
      numConta: '112233',
      tipoConta: 'CC',
      dtInclusao: 20240605,
      usrInclusao: 'admin',
      descontos: {
        create: [
          { tipoDesconto: TIPO_DESCONTO.CONTRIB_SOCIAL, pctDesconto: 3 },
          { tipoDesconto: TIPO_DESCONTO.SINDICAL, pctDesconto: 1 },
        ],
      },
    },
  })

  // Pagamento que **estoura o teto de 30%** (INV-32): 3 + 1 + 25 + 15 = 44% do bruto.
  // Existe para que o corte apareça na tela sem precisar montar o caso à mão.
  await db.pagamento.create({
    data: {
      numPagamento: 900003,
      numCpf: criados[2]!.numCpf,
      numInscricao: 100003,
      codPrograma: bolsa.codPrograma,
      anoMesRef: 202411,
      numCiclo: 11,
      vlrBruto: 1000,
      vlrDescontoTotal: 300,
      vlrLiquido: 700,
      sitPagamento: SIT_PAGAMENTO.EMITIDO,
      dtGeracao: 20241105,
      dtEmissao: 20241110,
      codBanco: '033',
      codAgencia: '9876',
      numConta: '445566',
      tipoConta: 'PP',
      dtInclusao: 20241105,
      usrInclusao: 'admin',
      descontos: {
        create: [
          { tipoDesconto: TIPO_DESCONTO.CONTRIB_SOCIAL, pctDesconto: 3 },
          { tipoDesconto: TIPO_DESCONTO.SINDICAL, pctDesconto: 1 },
          {
            tipoDesconto: TIPO_DESCONTO.PENSAO_ALIMENTICIA,
            pctDesconto: 25,
            numProcesso: '0001234-56.2024.8.06.0001',
            dtInicioDsct: 20240301,
          },
          {
            tipoDesconto: TIPO_DESCONTO.JUDICIAL,
            pctDesconto: 15,
            numProcesso: '0009876-54.2023.8.06.0001',
            dtInicioDsct: 20230801,
          },
        ],
      },
    },
  })

  // --- auditoria -----------------------------------------------------------
  await db.auditoria.createMany({
    data: [
      {
        numAuditoria: 1,
        dtEvento: 20241205,
        hrEvento: 30015,
        codAcao: 'INC',
        codModulo: 'PAGAMENTO',
        desAcao: 'Inclusão de pagamento',
        tipoEntidade: 'Pagamento',
        idEntidade: String(pgtoDezembro.id),
        numCpfAfetado: criados[0]!.numCpf,
        usrEvento: 'admin',
        nomeUsuario: 'Administrador',
        codPerfil: 'ADMIN',
        codLotacao: 'SEDE',
        ipOrigem: '10.0.0.15',
        idSessao: 'seed-0001',
      },
      {
        numAuditoria: 2,
        dtEvento: 20241206,
        hrEvento: 20000,
        codAcao: 'BAT',
        codModulo: 'BATCH',
        desAcao: 'Ciclo de geração de pagamentos',
        tipoEntidade: 'Pagamento',
        usrEvento: 'sistema',
        numCicloBatch: 12,
        numSeqBatch: 1,
        nomJobBatch: 'GERAPGTO',
        sitBatch: 'OK',
        idCorrelacao: 'ciclo-202412',
        numSeqCorrelacao: 1,
      },
    ],
  })

  console.log('seed concluído:', {
    usuarios: await db.usuario.count(),
    programas: await db.programaSocial.count(),
    faixas: await db.programaSocialGrpFaixaCalculo.count(),
    paramsRegionais: await db.programaSocialGrpParamRegional.count(),
    beneficiarios: await db.beneficiario.count(),
    dependentes: await db.beneficiarioGrpDependente.count(),
    pagamentos: await db.pagamento.count(),
    descontos: await db.pagamentoGrpDesconto.count(),
    auditorias: await db.auditoria.count(),
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => void db.$disconnect())
