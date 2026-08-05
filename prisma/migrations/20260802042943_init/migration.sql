-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "login" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "codPerfil" TEXT NOT NULL DEFAULT 'OPER',
    "codLotacao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "sessao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" INTEGER NOT NULL,
    "expiraEm" DATETIME NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "programa_social" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codPrograma" TEXT,
    "nomePrograma" TEXT,
    "siglaPrograma" TEXT,
    "tipoPrograma" TEXT,
    "orgaoResponsavel" TEXT,
    "leiCriacao" TEXT,
    "dtCriacao" REAL,
    "dtEncerramento" REAL,
    "sitPrograma" TEXT,
    "vlrBaseIndividual" REAL,
    "vlrBaseFamiliar" REAL,
    "vlrTetoBenef" REAL,
    "vlrPisoBenef" REAL,
    "pctReajusteAnual" REAL,
    "dtUltReajuste" REAL,
    "fatorK" REAL,
    "rendaMaxPercap" REAL,
    "idadeMin" REAL,
    "idadeMax" REAL,
    "indExigeFilhos" TEXT,
    "qtdMinFilhos" REAL,
    "indExigeEscola" TEXT,
    "indExigeVacina" TEXT,
    "indExigePrenatal" TEXT,
    "indExigeBiometria" TEXT,
    "dtInclusao" REAL,
    "usrInclusao" TEXT,
    "dtUltAlteracao" REAL,
    "usrUltAlteracao" TEXT
);

-- CreateTable
CREATE TABLE "programa_social_grp_faixa_calculo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rendaInicio" REAL,
    "rendaFim" REAL,
    "fatorMultiplicador" REAL,
    "vlrAdicional" REAL,
    "indAcumulativo" TEXT,
    "programaSocialId" INTEGER,
    CONSTRAINT "programa_social_grp_faixa_calculo_programaSocialId_fkey" FOREIGN KEY ("programaSocialId") REFERENCES "programa_social" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "programa_social_grp_param_regional" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codRegiao" TEXT,
    "fatorRegional" REAL,
    "vlrComplementoReg" REAL,
    "indAtivoRegiao" TEXT,
    "programaSocialId" INTEGER,
    CONSTRAINT "programa_social_grp_param_regional_programaSocialId_fkey" FOREIGN KEY ("programaSocialId") REFERENCES "programa_social" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numAuditoria" REAL,
    "dtEvento" REAL,
    "hrEvento" REAL,
    "tsEvento" REAL,
    "codAcao" TEXT,
    "codModulo" TEXT,
    "desAcao" TEXT,
    "tipoEntidade" TEXT,
    "idEntidade" TEXT,
    "numCpfAfetado" TEXT,
    "usrEvento" TEXT,
    "nomeUsuario" TEXT,
    "codPerfil" TEXT,
    "codLotacao" TEXT,
    "ipOrigem" TEXT,
    "idSessao" TEXT,
    "numCicloBatch" REAL,
    "numSeqBatch" REAL,
    "nomJobBatch" TEXT,
    "sitBatch" TEXT,
    "desErroBatch" TEXT,
    "idCorrelacao" TEXT,
    "numSeqCorrelacao" REAL
);

-- CreateTable
CREATE TABLE "beneficiario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numInscricao" REAL,
    "numCpf" TEXT,
    "nomeCompleto" TEXT,
    "nomeMae" TEXT,
    "nomePai" TEXT,
    "dtNascimento" REAL,
    "sexo" TEXT,
    "estCivil" TEXT,
    "rgNumero" TEXT,
    "rgOrgao" TEXT,
    "rgUf" TEXT,
    "rgDtExpedicao" REAL,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "municipio" TEXT,
    "uf" TEXT,
    "cep" REAL,
    "codIbge" REAL,
    "codRegiao" TEXT,
    "codPrograma" TEXT,
    "dtCadastro" REAL,
    "dtInicioBenef" REAL,
    "dtFimBenef" REAL,
    "sitBeneficiario" TEXT,
    "motSituacao" TEXT,
    "dtUltSituacao" REAL,
    "vlrRendaFamiliar" REAL,
    "qtdMembrosFamilia" REAL,
    "indRendaPercap" REAL,
    "telFixo" TEXT,
    "telCelular" TEXT,
    "email" TEXT,
    "indBiometria" TEXT,
    "dtColetaBio" REAL,
    "codPostoBio" TEXT,
    "hashDigital" TEXT,
    "dtInclusao" REAL,
    "hrInclusao" REAL,
    "usrInclusao" TEXT,
    "dtUltAlteracao" REAL,
    "hrUltAlteracao" REAL,
    "usrUltAlteracao" TEXT,
    "numVersao" REAL DEFAULT 1
);

-- CreateTable
CREATE TABLE "beneficiario_grp_dependente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpfDependente" TEXT,
    "nomeDependente" TEXT,
    "dtNascDepend" REAL,
    "parentesco" TEXT,
    "sitDependente" TEXT,
    "indDeficiencia" TEXT,
    "beneficiarioId" INTEGER,
    CONSTRAINT "beneficiario_grp_dependente_beneficiarioId_fkey" FOREIGN KEY ("beneficiarioId") REFERENCES "beneficiario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pagamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numPagamento" REAL,
    "numCpf" TEXT,
    "numInscricao" REAL,
    "codPrograma" TEXT,
    "anoMesRef" REAL,
    "numCiclo" REAL,
    "vlrBruto" REAL,
    "vlrLiquido" REAL,
    "vlrDescontoTotal" REAL,
    "sitPagamento" TEXT,
    "dtGeracao" REAL,
    "hrGeracao" REAL,
    "dtEmissao" REAL,
    "dtConfirmacao" REAL,
    "dtCancelamento" REAL,
    "motCancelamento" TEXT,
    "codBanco" TEXT,
    "codAgencia" TEXT,
    "numConta" TEXT,
    "tipoConta" TEXT,
    "codOperacao" TEXT,
    "numObSiafi" TEXT,
    "numNeSiafi" TEXT,
    "codUgEmitente" TEXT,
    "codGestao" TEXT,
    "sitIntegSiafi" TEXT,
    "dtConciliacao" REAL,
    "sitConciliacao" TEXT,
    "vlrConciliado" REAL,
    "codRetornoBanco" TEXT,
    "desRetornoBanco" TEXT,
    "hashArqRemessa" TEXT,
    "hashArqRetorno" TEXT,
    "dtInclusao" REAL,
    "hrInclusao" REAL,
    "usrInclusao" TEXT,
    "dtUltAlteracao" REAL,
    "hrUltAlteracao" REAL,
    "usrUltAlteracao" TEXT
);

-- CreateTable
CREATE TABLE "pagamento_grp_desconto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipoDesconto" TEXT,
    "vlrDesconto" REAL,
    "pctDesconto" REAL,
    "numProcesso" TEXT,
    "dtInicioDsct" REAL,
    "dtFimDsct" REAL,
    "pagamentoId" INTEGER,
    CONSTRAINT "pagamento_grp_desconto_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "pagamento" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_login_key" ON "usuario"("login");

-- CreateIndex
CREATE INDEX "sessao_usuarioId_idx" ON "sessao"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "programa_social_codPrograma_key" ON "programa_social"("codPrograma");

-- CreateIndex
CREATE INDEX "programa_social_grp_faixa_calculo_programaSocialId_idx" ON "programa_social_grp_faixa_calculo"("programaSocialId");

-- CreateIndex
CREATE INDEX "programa_social_grp_param_regional_programaSocialId_idx" ON "programa_social_grp_param_regional"("programaSocialId");

-- CreateIndex
CREATE INDEX "auditoria_dtEvento_idx" ON "auditoria"("dtEvento");

-- CreateIndex
CREATE INDEX "auditoria_tipoEntidade_idEntidade_idx" ON "auditoria"("tipoEntidade", "idEntidade");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiario_numInscricao_key" ON "beneficiario"("numInscricao");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiario_numCpf_key" ON "beneficiario"("numCpf");

-- CreateIndex
CREATE INDEX "beneficiario_codPrograma_idx" ON "beneficiario"("codPrograma");

-- CreateIndex
CREATE INDEX "beneficiario_grp_dependente_beneficiarioId_idx" ON "beneficiario_grp_dependente"("beneficiarioId");

-- CreateIndex
CREATE UNIQUE INDEX "pagamento_numPagamento_key" ON "pagamento"("numPagamento");

-- CreateIndex
CREATE INDEX "pagamento_numCpf_idx" ON "pagamento"("numCpf");

-- CreateIndex
CREATE INDEX "pagamento_anoMesRef_idx" ON "pagamento"("anoMesRef");

-- CreateIndex
CREATE INDEX "pagamento_grp_desconto_pagamentoId_idx" ON "pagamento_grp_desconto"("pagamentoId");
