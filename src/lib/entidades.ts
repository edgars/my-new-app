/**
 * Metadados das 8 entidades gerenciadas.
 *
 * Fonte da ordem dos campos e dos rótulos: `docs/ux/DESIGN.md`.
 * Fonte dos tipos: `docs/architecture.md`.
 * Fonte das colunas de listagem: divergência D-03 (a fonte marcava 100% dos
 * campos como coluna de lista, o que dá tabela de 44 colunas — despejo, não tela).
 *
 * ── Divergência S-06, registrada aqui ────────────────────────────────────────
 * `DESIGN.md` marca `Component = input` para **todos** os campos, dos 8 grupos.
 * Uniformidade de 100% é default de gerador, não decisão de UX: `dtNascimento`
 * e `indBiometria` não são o mesmo controle. O componente abaixo é derivado do
 * prefixo do nome (`dt` → data, `hr` → hora, `vlr` → moeda, `pct` → percentual,
 * `ind` → indicador S/N), que é a convenção do próprio legado.
 * O tipo **armazenado** não muda: continua Float YYYYMMDD / HHMMSS (S-04).
 */

export type Componente =
  | 'texto'
  | 'numero'
  | 'identificador'
  | 'data'
  | 'hora'
  | 'moeda'
  | 'percentual'
  | 'indicador'
  | 'cpf'

export interface CampoSpec {
  nome: string
  rotulo: string
  componente: Componente
  /** Tipo da coluna no banco. */
  tipo: 'String' | 'Float'
  obrigatorio: boolean
  naLista: boolean
}

export interface EntidadeSpec {
  chave: string
  /** Nome do delegate no Prisma Client. */
  modelo: string
  rota: string
  titulo: string
  singular: string
  campos: CampoSpec[]
  /** Campos varridos pela busca da listagem. */
  busca: string[]
  /** FK para o pai, quando existe (S-02). */
  pai?: { campo: string; entidade: string; rotulo: string }
}

/**
 * Campos numéricos que são **identificador**, não quantidade.
 *
 * Separador de milhar neles produz absurdo: a competência 202411 vira "202.411"
 * e o pagamento 900003 vira "900.003". Descoberto pelo E2E, não por inspeção.
 */
function ehIdentificador(nome: string): boolean {
  return /^(num|cod)/.test(nome) || nome === 'cep' || nome === 'anoMesRef'
}

/** Deriva o componente do prefixo, seguindo a convenção do legado. */
function componenteDe(nome: string, tipo: 'String' | 'Float'): Componente {
  if (nome === 'numCpf' || nome === 'cpfDependente' || nome === 'numCpfAfetado') return 'cpf'
  if (/^dt/.test(nome)) return 'data'
  if (/^hr/.test(nome)) return 'hora'
  if (/^vlr/.test(nome)) return 'moeda'
  if (/^pct/.test(nome)) return 'percentual'
  if (/^ind/.test(nome) && tipo === 'String') return 'indicador'
  if (tipo === 'Float' && ehIdentificador(nome)) return 'identificador'
  return tipo === 'Float' ? 'numero' : 'texto'
}

/** 'codPrograma' → 'Cod Programa', como em DESIGN.md. */
function rotuloDe(nome: string): string {
  return nome
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

type Def = [nome: string, tipo: 'String' | 'Float']

function campos(defs: Def[], lista: string[], obrigatorios: string[] = []): CampoSpec[] {
  return defs.map(([nome, tipo]) => ({
    nome,
    rotulo: rotuloDe(nome),
    componente: componenteDe(nome, tipo),
    tipo,
    obrigatorio: obrigatorios.includes(nome),
    naLista: lista.includes(nome),
  }))
}

const S = 'String' as const
const F = 'Float' as const

export const PROGRAMA_SOCIAL: EntidadeSpec = {
  chave: 'programa_socials',
  modelo: 'programaSocial',
  rota: '/programa_socials',
  titulo: 'Programas Sociais',
  singular: 'Programa Social',
  busca: ['codPrograma', 'nomePrograma', 'siglaPrograma', 'orgaoResponsavel'],
  campos: campos(
    [
      ['codPrograma', S], ['nomePrograma', S], ['siglaPrograma', S], ['tipoPrograma', S],
      ['orgaoResponsavel', S], ['leiCriacao', S], ['dtCriacao', F], ['dtEncerramento', F],
      ['sitPrograma', S], ['vlrBaseIndividual', F], ['vlrBaseFamiliar', F],
      ['vlrTetoBenef', F], ['vlrPisoBenef', F], ['pctReajusteAnual', F],
      ['dtUltReajuste', F], ['fatorK', F], ['rendaMaxPercap', F], ['idadeMin', F],
      ['idadeMax', F], ['indExigeFilhos', S], ['qtdMinFilhos', F], ['indExigeEscola', S],
      ['indExigeVacina', S], ['indExigePrenatal', S], ['indExigeBiometria', S],
      ['dtInclusao', F], ['usrInclusao', S], ['dtUltAlteracao', F], ['usrUltAlteracao', S],
    ],
    ['codPrograma', 'nomePrograma', 'siglaPrograma', 'tipoPrograma', 'sitPrograma', 'vlrBaseIndividual'],
    // FR-15 exige unicidade de codPrograma; sem valor não há como garanti-la.
    ['codPrograma'],
  ),
}

export const FAIXA_CALCULO: EntidadeSpec = {
  chave: 'programa_social_grp_faixa_calculos',
  modelo: 'programaSocialGrpFaixaCalculo',
  rota: '/programa_social_grp_faixa_calculos',
  titulo: 'Faixas de Cálculo',
  singular: 'Faixa de Cálculo',
  busca: ['indAcumulativo'],
  pai: { campo: 'programaSocialId', entidade: 'programaSocial', rotulo: 'Programa Social' },
  campos: campos(
    [['rendaInicio', F], ['rendaFim', F], ['fatorMultiplicador', F], ['vlrAdicional', F], ['indAcumulativo', S]],
    ['rendaInicio', 'rendaFim', 'fatorMultiplicador', 'vlrAdicional', 'indAcumulativo'],
  ),
}

export const PARAM_REGIONAL: EntidadeSpec = {
  chave: 'programa_social_grp_param_regionals',
  modelo: 'programaSocialGrpParamRegional',
  rota: '/programa_social_grp_param_regionals',
  titulo: 'Parâmetros Regionais',
  singular: 'Parâmetro Regional',
  busca: ['codRegiao'],
  pai: { campo: 'programaSocialId', entidade: 'programaSocial', rotulo: 'Programa Social' },
  campos: campos(
    [['codRegiao', S], ['fatorRegional', F], ['vlrComplementoReg', F], ['indAtivoRegiao', S]],
    ['codRegiao', 'fatorRegional', 'vlrComplementoReg', 'indAtivoRegiao'],
  ),
}

export const AUDITORIA: EntidadeSpec = {
  chave: 'auditorias',
  modelo: 'auditoria',
  rota: '/auditorias',
  titulo: 'Auditoria',
  singular: 'Registro de Auditoria',
  busca: ['codAcao', 'codModulo', 'desAcao', 'tipoEntidade', 'usrEvento', 'numCpfAfetado'],
  campos: campos(
    [
      ['numAuditoria', F], ['dtEvento', F], ['hrEvento', F], ['tsEvento', F],
      ['codAcao', S], ['codModulo', S], ['desAcao', S], ['tipoEntidade', S],
      ['idEntidade', S], ['numCpfAfetado', S], ['usrEvento', S], ['nomeUsuario', S],
      ['codPerfil', S], ['codLotacao', S], ['ipOrigem', S], ['idSessao', S],
      ['numCicloBatch', F], ['numSeqBatch', F], ['nomJobBatch', S], ['sitBatch', S],
      ['desErroBatch', S], ['idCorrelacao', S], ['numSeqCorrelacao', F],
    ],
    ['dtEvento', 'hrEvento', 'codAcao', 'tipoEntidade', 'idEntidade', 'usrEvento'],
  ),
}

export const BENEFICIARIO: EntidadeSpec = {
  chave: 'beneficiarios',
  modelo: 'beneficiario',
  rota: '/beneficiarios',
  titulo: 'Beneficiários',
  singular: 'Beneficiário',
  busca: ['numCpf', 'nomeCompleto', 'nomeMae', 'municipio', 'uf'],
  campos: campos(
    [
      ['numInscricao', F], ['numCpf', S], ['nomeCompleto', S], ['nomeMae', S], ['nomePai', S],
      ['dtNascimento', F], ['sexo', S], ['estCivil', S], ['rgNumero', S], ['rgOrgao', S],
      ['rgUf', S], ['rgDtExpedicao', F], ['logradouro', S], ['numero', S], ['complemento', S],
      ['bairro', S], ['municipio', S], ['uf', S], ['cep', F], ['codIbge', F],
      ['codRegiao', S], ['codPrograma', S], ['dtCadastro', F], ['dtInicioBenef', F],
      ['dtFimBenef', F], ['sitBeneficiario', S], ['motSituacao', S], ['dtUltSituacao', F],
      ['vlrRendaFamiliar', F], ['qtdMembrosFamilia', F], ['indRendaPercap', F],
      ['telFixo', S], ['telCelular', S], ['email', S], ['indBiometria', S],
      ['dtColetaBio', F], ['codPostoBio', S], ['hashDigital', S], ['dtInclusao', F],
      ['hrInclusao', F], ['usrInclusao', S], ['dtUltAlteracao', F], ['hrUltAlteracao', F],
      ['usrUltAlteracao', S], ['numVersao', F],
    ],
    ['numInscricao', 'numCpf', 'nomeCompleto', 'dtNascimento', 'uf', 'sitBeneficiario'],
    // Divergência D-02: DESIGN.md marcava todos como opcionais, contra FR-12 e FR-13.
    ['numCpf', 'nomeCompleto', 'dtNascimento', 'sexo'],
  ),
}

export const DEPENDENTE: EntidadeSpec = {
  chave: 'beneficiario_grp_dependentes',
  modelo: 'beneficiarioGrpDependente',
  rota: '/beneficiario_grp_dependentes',
  titulo: 'Dependentes',
  singular: 'Dependente',
  busca: ['cpfDependente', 'nomeDependente', 'parentesco'],
  pai: { campo: 'beneficiarioId', entidade: 'beneficiario', rotulo: 'Beneficiário' },
  campos: campos(
    [
      ['cpfDependente', S], ['nomeDependente', S], ['dtNascDepend', F],
      ['parentesco', S], ['sitDependente', S], ['indDeficiencia', S],
    ],
    ['cpfDependente', 'nomeDependente', 'dtNascDepend', 'parentesco', 'sitDependente'],
  ),
}

export const PAGAMENTO: EntidadeSpec = {
  chave: 'pagamentos',
  modelo: 'pagamento',
  rota: '/pagamentos',
  titulo: 'Pagamentos',
  singular: 'Pagamento',
  busca: ['numCpf', 'codPrograma', 'sitPagamento', 'numObSiafi'],
  campos: campos(
    [
      ['numPagamento', F], ['numCpf', S], ['numInscricao', F], ['codPrograma', S],
      ['anoMesRef', F], ['numCiclo', F], ['vlrBruto', F], ['vlrLiquido', F],
      ['vlrDescontoTotal', F], ['sitPagamento', S], ['dtGeracao', F], ['hrGeracao', F],
      ['dtEmissao', F], ['dtConfirmacao', F], ['dtCancelamento', F], ['motCancelamento', S],
      ['codBanco', S], ['codAgencia', S], ['numConta', S], ['tipoConta', S],
      ['codOperacao', S], ['numObSiafi', S], ['numNeSiafi', S], ['codUgEmitente', S],
      ['codGestao', S], ['sitIntegSiafi', S], ['dtConciliacao', F], ['sitConciliacao', S],
      ['vlrConciliado', F], ['codRetornoBanco', S], ['desRetornoBanco', S],
      ['hashArqRemessa', S], ['hashArqRetorno', S], ['dtInclusao', F], ['hrInclusao', F],
      ['usrInclusao', S], ['dtUltAlteracao', F], ['hrUltAlteracao', F], ['usrUltAlteracao', S],
    ],
    ['numPagamento', 'numCpf', 'anoMesRef', 'vlrBruto', 'vlrDescontoTotal', 'vlrLiquido', 'sitPagamento'],
    ['numPagamento'],
  ),
}

export const DESCONTO: EntidadeSpec = {
  chave: 'pagamento_grp_descontos',
  modelo: 'pagamentoGrpDesconto',
  rota: '/pagamento_grp_descontos',
  titulo: 'Descontos',
  singular: 'Desconto',
  busca: ['tipoDesconto', 'numProcesso'],
  pai: { campo: 'pagamentoId', entidade: 'pagamento', rotulo: 'Pagamento' },
  campos: campos(
    [
      ['tipoDesconto', S], ['vlrDesconto', F], ['pctDesconto', F],
      ['numProcesso', S], ['dtInicioDsct', F], ['dtFimDsct', F],
    ],
    ['tipoDesconto', 'vlrDesconto', 'pctDesconto', 'dtInicioDsct', 'dtFimDsct'],
  ),
}

export const ENTIDADES: EntidadeSpec[] = [
  PROGRAMA_SOCIAL,
  FAIXA_CALCULO,
  PARAM_REGIONAL,
  BENEFICIARIO,
  DEPENDENTE,
  PAGAMENTO,
  DESCONTO,
  AUDITORIA,
]

export function entidadePorChave(chave: string): EntidadeSpec | undefined {
  return ENTIDADES.find((e) => e.chave === chave)
}

export function colunasDaLista(e: EntidadeSpec): CampoSpec[] {
  return e.campos.filter((c) => c.naLista)
}
