package com.app.rules;

import org.springframework.stereotype.Service;

/**
 * Business rules extracted from the legacy UIR. Field-level constraints are already
 * enforced by Bean Validation on the entities; the rules below need review/impl.
 */
@Service
public class BusinessRules {

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule PASTAFUNCION_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule PASTAFUNCION_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule PASTAFUNCION_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule PASTAFUNCION_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule PASTAFUNCION_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule PASTAFUNCION_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule PASTAFUNCION_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule PASTAFUNCION_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule PASTAFUNCION_BR-Funcionario-email-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule PASTAFUNCION_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule PASTAFUNCION_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule PASTAFUNCION_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule PASTAFUNCION_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule PASTAFUNCION_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule PASTAFUNCION_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule PASTAFUNCION_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule PASTAFUNCION_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule PASTAFUNCION_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule PASTAFUNCION_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule PASTAFUNCION_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule PASTAFUNCION_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule PASTAFUNCION_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void pASTAFUNCION_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule PASTAFUNCION_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * funcionario é obrigatório
     * Condition: funcionario != null
     * Legacy: @NotNull funcionario
     * Rule DEPENDENTEMB_BR-Dependente-funcionario-NotNull (VALIDATION)
     */
    public void dEPENDENTEMB_BR_Dependente_funcionario_NotNull() {
        // TODO(rnc): implement business rule DEPENDENTEMB_BR-Dependente-funcionario-NotNull
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule DEPENDENTEMB_BR-Dependente-nome-NotNull (VALIDATION)
     */
    public void dEPENDENTEMB_BR_Dependente_nome_NotNull() {
        // TODO(rnc): implement business rule DEPENDENTEMB_BR-Dependente-nome-NotNull
    }

    /**
     * nome comprimento máx 200
     * Condition: len(nome) <= 200
     * Legacy: @Size nome
     * Rule DEPENDENTEMB_BR-Dependente-nome-Size (VALIDATION)
     */
    public void dEPENDENTEMB_BR_Dependente_nome_Size() {
        // TODO(rnc): implement business rule DEPENDENTEMB_BR-Dependente-nome-Size
    }

    /**
     * parentesco comprimento máx 20
     * Condition: len(parentesco) <= 20
     * Legacy: @Size parentesco
     * Rule DEPENDENTEMB_BR-Dependente-parentesco-Size (VALIDATION)
     */
    public void dEPENDENTEMB_BR_Dependente_parentesco_Size() {
        // TODO(rnc): implement business rule DEPENDENTEMB_BR-Dependente-parentesco-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule DEPENDENTEMB_BR-Dependente-cpf-Size (VALIDATION)
     */
    public void dEPENDENTEMB_BR_Dependente_cpf_Size() {
        // TODO(rnc): implement business rule DEPENDENTEMB_BR-Dependente-cpf-Size
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule CAPACITACAOM_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule CAPACITACAOM_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule CAPACITACAOM_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule CAPACITACAOM_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule CAPACITACAOM_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule CAPACITACAOM_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule CAPACITACAOM_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule CAPACITACAOM_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule CAPACITACAOM_BR-Funcionario-email-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule CAPACITACAOM_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule CAPACITACAOM_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule CAPACITACAOM_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule CAPACITACAOM_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule CAPACITACAOM_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule CAPACITACAOM_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule CAPACITACAOM_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule CAPACITACAOM_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule CAPACITACAOM_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule CAPACITACAOM_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule CAPACITACAOM_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule CAPACITACAOM_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule CAPACITACAOM_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void cAPACITACAOM_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule CAPACITACAOM_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * local é obrigatório
     * Condition: local != null
     * Legacy: @NotNull local
     * Rule GERENTEMB_JA_BR-Lotacao-local-NotNull (VALIDATION)
     */
    public void gERENTEMB_JA_BR_Lotacao_local_NotNull() {
        // TODO(rnc): implement business rule GERENTEMB_JA_BR-Lotacao-local-NotNull
    }

    /**
     * postoGraduacao é obrigatório
     * Condition: postoGraduacao != null
     * Legacy: @NotNull postoGraduacao
     * Rule GERENTEMB_JA_BR-Lotacao-postoGraduacao-NotNull (VALIDATION)
     */
    public void gERENTEMB_JA_BR_Lotacao_postoGraduacao_NotNull() {
        // TODO(rnc): implement business rule GERENTEMB_JA_BR-Lotacao-postoGraduacao-NotNull
    }

    /**
     * funcaoQDI é obrigatório
     * Condition: funcaoQDI != null
     * Legacy: @NotNull funcaoQDI
     * Rule GERENTEMB_JA_BR-Lotacao-funcaoQDI-NotNull (VALIDATION)
     */
    public void gERENTEMB_JA_BR_Lotacao_funcaoQDI_NotNull() {
        // TODO(rnc): implement business rule GERENTEMB_JA_BR-Lotacao-funcaoQDI-NotNull
    }

    /**
     * obs comprimento máx 200
     * Condition: len(obs) <= 200
     * Legacy: @Size obs
     * Rule GERENTEMB_JA_BR-Lotacao-obs-Size (VALIDATION)
     */
    public void gERENTEMB_JA_BR_Lotacao_obs_Size() {
        // TODO(rnc): implement business rule GERENTEMB_JA_BR-Lotacao-obs-Size
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule FORMULARIOTR_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule FORMULARIOTR_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule FORMULARIOTR_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule FORMULARIOTR_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule FORMULARIOTR_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule FORMULARIOTR_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule FORMULARIOTR_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule FORMULARIOTR_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule FORMULARIOTR_BR-Funcionario-email-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule FORMULARIOTR_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule FORMULARIOTR_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule FORMULARIOTR_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule FORMULARIOTR_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule FORMULARIOTR_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule FORMULARIOTR_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule FORMULARIOTR_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule FORMULARIOTR_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule FORMULARIOTR_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule FORMULARIOTR_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule FORMULARIOTR_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule FORMULARIOTR_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule FORMULARIOTR_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void fORMULARIOTR_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule FORMULARIOTR_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule FUNCIONARIOM_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule FUNCIONARIOM_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule FUNCIONARIOM_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule FUNCIONARIOM_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule FUNCIONARIOM_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule FUNCIONARIOM_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule FUNCIONARIOM_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule FUNCIONARIOM_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule FUNCIONARIOM_BR-Funcionario-email-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule FUNCIONARIOM_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule FUNCIONARIOM_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule FUNCIONARIOM_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule FUNCIONARIOM_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule FUNCIONARIOM_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule FUNCIONARIOM_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule FUNCIONARIOM_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule FUNCIONARIOM_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule FUNCIONARIOM_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule FUNCIONARIOM_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule FUNCIONARIOM_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule FUNCIONARIOM_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule FUNCIONARIOM_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void fUNCIONARIOM_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule FUNCIONARIOM_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule PROMOCAOMB_J_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule PROMOCAOMB_J_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule PROMOCAOMB_J_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule PROMOCAOMB_J_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule PROMOCAOMB_J_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule PROMOCAOMB_J_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule PROMOCAOMB_J_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule PROMOCAOMB_J_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule PROMOCAOMB_J_BR-Funcionario-email-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule PROMOCAOMB_J_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule PROMOCAOMB_J_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule PROMOCAOMB_J_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule PROMOCAOMB_J_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule PROMOCAOMB_J_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule PROMOCAOMB_J_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule PROMOCAOMB_J_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule PROMOCAOMB_J_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule PROMOCAOMB_J_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule PROMOCAOMB_J_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule PROMOCAOMB_J_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule PROMOCAOMB_J_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule PROMOCAOMB_J_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void pROMOCAOMB_J_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule PROMOCAOMB_J_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule FORMULARIOFE_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule FORMULARIOFE_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule FORMULARIOFE_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule FORMULARIOFE_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule FORMULARIOFE_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule FORMULARIOFE_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule FORMULARIOFE_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule FORMULARIOFE_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule FORMULARIOFE_BR-Funcionario-email-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule FORMULARIOFE_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule FORMULARIOFE_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule FORMULARIOFE_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule FORMULARIOFE_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule FORMULARIOFE_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule FORMULARIOFE_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule FORMULARIOFE_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule FORMULARIOFE_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule FORMULARIOFE_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule FORMULARIOFE_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule FORMULARIOFE_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule FORMULARIOFE_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule FORMULARIOFE_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void fORMULARIOFE_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule FORMULARIOFE_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule HISTORICOCHA_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule HISTORICOCHA_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule HISTORICOCHA_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule HISTORICOCHA_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule HISTORICOCHA_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule HISTORICOCHA_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule HISTORICOCHA_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule HISTORICOCHA_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule HISTORICOCHA_BR-Funcionario-email-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule HISTORICOCHA_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule HISTORICOCHA_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule HISTORICOCHA_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule HISTORICOCHA_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule HISTORICOCHA_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule HISTORICOCHA_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule HISTORICOCHA_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule HISTORICOCHA_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule HISTORICOCHA_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule HISTORICOCHA_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule HISTORICOCHA_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule HISTORICOCHA_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule HISTORICOCHA_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void hISTORICOCHA_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule HISTORICOCHA_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * mensagem é obrigatório
     * Condition: mensagem != null
     * Legacy: @NotNull mensagem
     * Rule AVISOSUSUARI_BR-AvisosUsuario-mensagem-NotNull (VALIDATION)
     */
    public void aVISOSUSUARI_BR_AvisosUsuario_mensagem_NotNull() {
        // TODO(rnc): implement business rule AVISOSUSUARI_BR-AvisosUsuario-mensagem-NotNull
    }

    /**
     * mensagem comprimento máx 512
     * Condition: len(mensagem) <= 512
     * Legacy: @Size mensagem
     * Rule AVISOSUSUARI_BR-AvisosUsuario-mensagem-Size (VALIDATION)
     */
    public void aVISOSUSUARI_BR_AvisosUsuario_mensagem_Size() {
        // TODO(rnc): implement business rule AVISOSUSUARI_BR-AvisosUsuario-mensagem-Size
    }

    /**
     * perfil comprimento máx 50
     * Condition: len(perfil) <= 50
     * Legacy: @Size perfil
     * Rule AVISOSUSUARI_BR-AvisosUsuario-perfil-Size (VALIDATION)
     */
    public void aVISOSUSUARI_BR_AvisosUsuario_perfil_Size() {
        // TODO(rnc): implement business rule AVISOSUSUARI_BR-AvisosUsuario-perfil-Size
    }

    /**
     * data é obrigatório
     * Condition: data != null
     * Legacy: @NotNull data
     * Rule AVISOSUSUARI_BR-AvisosUsuario-data-NotNull (VALIDATION)
     */
    public void aVISOSUSUARI_BR_AvisosUsuario_data_NotNull() {
        // TODO(rnc): implement business rule AVISOSUSUARI_BR-AvisosUsuario-data-NotNull
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule IDENTIDADEFU_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule IDENTIDADEFU_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule IDENTIDADEFU_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule IDENTIDADEFU_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule IDENTIDADEFU_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule IDENTIDADEFU_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule IDENTIDADEFU_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule IDENTIDADEFU_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule IDENTIDADEFU_BR-Funcionario-email-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule IDENTIDADEFU_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule IDENTIDADEFU_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule IDENTIDADEFU_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule IDENTIDADEFU_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule IDENTIDADEFU_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule IDENTIDADEFU_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule IDENTIDADEFU_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule IDENTIDADEFU_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule IDENTIDADEFU_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule IDENTIDADEFU_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule IDENTIDADEFU_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule IDENTIDADEFU_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule IDENTIDADEFU_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void iDENTIDADEFU_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule IDENTIDADEFU_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule FUNCIONARIOV_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule FUNCIONARIOV_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule FUNCIONARIOV_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule FUNCIONARIOV_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule FUNCIONARIOV_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule FUNCIONARIOV_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule FUNCIONARIOV_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule FUNCIONARIOV_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule FUNCIONARIOV_BR-Funcionario-email-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule FUNCIONARIOV_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule FUNCIONARIOV_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule FUNCIONARIOV_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule FUNCIONARIOV_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule FUNCIONARIOV_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule FUNCIONARIOV_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule FUNCIONARIOV_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule FUNCIONARIOV_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule FUNCIONARIOV_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule FUNCIONARIOV_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule FUNCIONARIOV_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule FUNCIONARIOV_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule FUNCIONARIOV_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void fUNCIONARIOV_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule FUNCIONARIOV_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule AFASTAMENTOS_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule AFASTAMENTOS_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule AFASTAMENTOS_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule AFASTAMENTOS_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule AFASTAMENTOS_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule AFASTAMENTOS_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule AFASTAMENTOS_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule AFASTAMENTOS_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule AFASTAMENTOS_BR-Funcionario-email-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule AFASTAMENTOS_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule AFASTAMENTOS_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule AFASTAMENTOS_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule AFASTAMENTOS_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule AFASTAMENTOS_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule AFASTAMENTOS_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule AFASTAMENTOS_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule AFASTAMENTOS_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule AFASTAMENTOS_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule AFASTAMENTOS_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule AFASTAMENTOS_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule AFASTAMENTOS_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule AFASTAMENTOS_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void aFASTAMENTOS_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule AFASTAMENTOS_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

    /**
     * nome é obrigatório
     * Condition: nome != null
     * Legacy: @NotNull nome
     * Rule FUNCIONARIOF_BR-Funcionario-nome-NotNull (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_nome_NotNull() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-nome-NotNull
    }

    /**
     * nome comprimento máx 100
     * Condition: len(nome) <= 100
     * Legacy: @Size nome
     * Rule FUNCIONARIOF_BR-Funcionario-nome-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_nome_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-nome-Size
    }

    /**
     * nomeGuerra comprimento máx 100
     * Condition: len(nomeGuerra) <= 100
     * Legacy: @Size nomeGuerra
     * Rule FUNCIONARIOF_BR-Funcionario-nomeGuerra-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_nomeGuerra_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-nomeGuerra-Size
    }

    /**
     * numeroFuncional é obrigatório
     * Condition: numeroFuncional != null
     * Legacy: @NotNull numeroFuncional
     * Rule FUNCIONARIOF_BR-Funcionario-numeroFuncional-NotNull (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_numeroFuncional_NotNull() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-numeroFuncional-NotNull
    }

    /**
     * numeroFuncional comprimento máx 20
     * Condition: len(numeroFuncional) <= 20
     * Legacy: @Size numeroFuncional
     * Rule FUNCIONARIOF_BR-Funcionario-numeroFuncional-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_numeroFuncional_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-numeroFuncional-Size
    }

    /**
     * cpf comprimento máx 14
     * Condition: len(cpf) <= 14
     * Legacy: @Size cpf
     * Rule FUNCIONARIOF_BR-Funcionario-cpf-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_cpf_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-cpf-Size
    }

    /**
     * fone comprimento máx 100
     * Condition: len(fone) <= 100
     * Legacy: @Size fone
     * Rule FUNCIONARIOF_BR-Funcionario-fone-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_fone_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-fone-Size
    }

    /**
     * celular comprimento máx 100
     * Condition: len(celular) <= 100
     * Legacy: @Size celular
     * Rule FUNCIONARIOF_BR-Funcionario-celular-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_celular_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-celular-Size
    }

    /**
     * email comprimento máx 200
     * Condition: len(email) <= 200
     * Legacy: @Size email
     * Rule FUNCIONARIOF_BR-Funcionario-email-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_email_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-email-Size
    }

    /**
     * cidadeNascimento comprimento máx 50
     * Condition: len(cidadeNascimento) <= 50
     * Legacy: @Size cidadeNascimento
     * Rule FUNCIONARIOF_BR-Funcionario-cidadeNascimento-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_cidadeNascimento_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-cidadeNascimento-Size
    }

    /**
     * paisNascimento comprimento máx 50
     * Condition: len(paisNascimento) <= 50
     * Legacy: @Size paisNascimento
     * Rule FUNCIONARIOF_BR-Funcionario-paisNascimento-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_paisNascimento_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-paisNascimento-Size
    }

    /**
     * nacionalidade comprimento máx 50
     * Condition: len(nacionalidade) <= 50
     * Legacy: @Size nacionalidade
     * Rule FUNCIONARIOF_BR-Funcionario-nacionalidade-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_nacionalidade_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-nacionalidade-Size
    }

    /**
     * nomePai comprimento máx 200
     * Condition: len(nomePai) <= 200
     * Legacy: @Size nomePai
     * Rule FUNCIONARIOF_BR-Funcionario-nomePai-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_nomePai_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-nomePai-Size
    }

    /**
     * nomeMae comprimento máx 200
     * Condition: len(nomeMae) <= 200
     * Legacy: @Size nomeMae
     * Rule FUNCIONARIOF_BR-Funcionario-nomeMae-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_nomeMae_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-nomeMae-Size
    }

    /**
     * prontuarioHPM comprimento máx 20
     * Condition: len(prontuarioHPM) <= 20
     * Legacy: @Size prontuarioHPM
     * Rule FUNCIONARIOF_BR-Funcionario-prontuarioHPM-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_prontuarioHPM_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-prontuarioHPM-Size
    }

    /**
     * tipoCadastro comprimento máx 50
     * Condition: len(tipoCadastro) <= 50
     * Legacy: @Size tipoCadastro
     * Rule FUNCIONARIOF_BR-Funcionario-tipoCadastro-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_tipoCadastro_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-tipoCadastro-Size
    }

    /**
     * corOlhos comprimento máx 50
     * Condition: len(corOlhos) <= 50
     * Legacy: @Size corOlhos
     * Rule FUNCIONARIOF_BR-Funcionario-corOlhos-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_corOlhos_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-corOlhos-Size
    }

    /**
     * corCabelos comprimento máx 50
     * Condition: len(corCabelos) <= 50
     * Legacy: @Size corCabelos
     * Rule FUNCIONARIOF_BR-Funcionario-corCabelos-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_corCabelos_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-corCabelos-Size
    }

    /**
     * sinaisParticulares comprimento máx 50
     * Condition: len(sinaisParticulares) <= 50
     * Legacy: @Size sinaisParticulares
     * Rule FUNCIONARIOF_BR-Funcionario-sinaisParticulares-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_sinaisParticulares_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-sinaisParticulares-Size
    }

    /**
     * altura comprimento máx 10
     * Condition: len(altura) <= 10
     * Legacy: @Size altura
     * Rule FUNCIONARIOF_BR-Funcionario-altura-Size (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_altura_Size() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-altura-Size
    }

    /**
     * numeroFuncional não pode ser duplicado
     * Condition: count(numeroFuncional) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.numeroFuncional= :numeroFuncional
     * Rule FUNCIONARIOF_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_UNIQUE_naoDeveExistirNumeroFuncionalDuplicado() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-UNIQUE-naoDeveExistirNumeroFuncionalDuplicado
    }

    /**
     * cpf não pode ser duplicado
     * Condition: count(cpf) == 0
     * Legacy: select count(*) from FuncionarioEntity obj where obj.cpf= :cpf
     * Rule FUNCIONARIOF_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado (VALIDATION)
     */
    public void fUNCIONARIOF_BR_Funcionario_UNIQUE_naoDeveExistircpfDuplicado() {
        // TODO(rnc): implement business rule FUNCIONARIOF_BR-Funcionario-UNIQUE-naoDeveExistircpfDuplicado
    }

}
