# Business Rules

| ID | Description | Condition | Severity | Type | Status |
|---|---|---|---|---|---|
| BR-ERR-001 | RAISERROR codes 50000-50001 carry business-rule violations raised by stored procedures; ErroDB_Controlado routes them to the user | NativeError in [50000-50001] | WARN | IF_STATEMENT | **NEEDS REVIEW** |
| BR-IF-001 | Formato da data no sistema n�o pode ser alterado. Favor contatar suporte. | SetLocaleInfo(dwLCID, LOCALE_SSHORTDATE, "dd/MM/yyyy") = False | WARN | IF_STATEMENT | ready |
| BR-IF-002 | Confirma��o inv�lida para altera��o da senha. | txtConfirmacao <> txtSenhaNova | WARN | IF_STATEMENT | ready |
| BR-IF-003 | Senha de f�cil reconhecimento. Digite outra senha. | txtSenhaNova.text = txtLogin.text | WARN | IF_STATEMENT | ready |
| BR-IF-004 | Senha de f�cil reconhecimento. Digite outra senha. | InStr(1, UCase(txtSenhaNova.text), "SENHA") <> 0 Or InStr(1, UCase(txtSenhaNova.text), "PASSWORD") <> 0 | WARN | IF_STATEMENT | ready |
| BR-IF-005 | O prazo de validade de sua senha expirou. | cmd("@TrocaSenha") = 1 | WARN | IF_STATEMENT | ready |
| BR-IF-006 | Sua senha deve possuir os seguintes par�metros: | Not ValidaSenha(txtSenhaNova) | WARN | IF_STATEMENT | ready |
| BR-IF-007 | Erro na troca de senha! | Err.number <> 0 | WARN | IF_STATEMENT | ready |
| BR-IF-008 | Sua senha foi alterada com sucesso. | cmd("@Retorno") = gintRETORNO_SP_OK | WARN | IF_STATEMENT | ready |
| BR-IF-001 | N�o foi pass�vel carregar imagem. | Err.number <> 0 | WARN | IF_STATEMENT | ready |
| BR-IF-001 | Permiss�o inv�lida. | Trim(mskPermissao) <> vbNullString And Len(mskPermissao) <> 9 | WARN | IF_STATEMENT | ready |
| BR-IF-002 | Digito verificador n�o confere! | DvVerific(Left(Permissao.Numero, 8)) <> Permissao.DV | WARN | IF_STATEMENT | ready |
| BR-IF-003 | Permiss�o inv�lida. | Permissao.TpTran = 0 Or Permissao.TpPerm = 0 | WARN | IF_STATEMENT | ready |
| BR-IF-004 | Tipo de permiss�o n�o existe! | IsNull(cmd("@tipodepermissao")) | WARN | IF_STATEMENT | ready |
| BR-IF-005 | N�o existem opera��es poss�veis para a permiss�o informada. | registro.EOF And registro.BOF | WARN | IF_STATEMENT | ready |
| BR-IF-006 | N�o existem opera��es poss�veis para a permiss�o informada. | cboSolicitacoes.ListCount = 0 | WARN | IF_STATEMENT | ready |
| BR-SM-001 | SolicitacoesPossiveis consolidates 6 stored-procedure results into UI-facing state/options — state machine | state consolidation over: stu_sp_validTipodePermissao, stu_sp_list_permissao, stu_sp_list_veiculopermis, stu_sp_list_rotinas_modulo, stu_sp_list_solicitacoes_possiveis, stu_sp_solicitacoes_ativas | WARN | STATE_MACHINE | **NEEDS REVIEW** |
| BR-IF-001 | O arquivo de par�metros do STU n�o foi encontrado. | Dir(gstrArquivoINI) = "" | WARN | IF_STATEMENT | ready |
| BR-IF-002 | N�o foi poss�vel alimentar a caixa de op��es ' | rs.EOF And rs.BOF | WARN | IF_STATEMENT | ready |
| BR-IF-003 | N�o foi poss�vel carregar imagem de fundo! | Err.number <> 0 | WARN | IF_STATEMENT | ready |
| BR-IF-004 | N�O FOI POSS�VEL REGISTRAR O ERRO! | Err <> 0 | WARN | IF_STATEMENT | ready |
| BR-IF-005 | N�O FOI POSS�VEL REGISTRAR O ERRO! | Err <> 0 | WARN | IF_STATEMENT | ready |
| BR-ALG-001 | Check-digit / weighted-modulus algorithm in DvVerific | weighted sum over string digits, Mod-based check digit | WARN | ALGORITHM | ready |
| BR-IF-001 | Permiss�o inv�lida. | Trim(mskPermissao) <> vbNullString And Len(mskPermissao) <> 9 | WARN | IF_STATEMENT | ready |
| BR-IF-002 | Digito verificador n�o confere! | DvVerific(Left(Permissao.Numero, 8)) <> Permissao.DV | WARN | IF_STATEMENT | ready |
| BR-IF-003 | Permiss�o inv�lida. | Permissao.TpTran = 0 Or Permissao.TpPerm = 0 | WARN | IF_STATEMENT | ready |
| BR-IF-004 | Tipo de permiss�o n�o existe! | IsNull(cmd("@tipodepermissao")) | WARN | IF_STATEMENT | ready |
| BR-IF-005 | N�o existem opera��es poss�veis para a permiss�o informada. | registro.EOF And registro.BOF | WARN | IF_STATEMENT | ready |
| BR-IF-006 | N�o existem opera��es poss�veis para a permiss�o informada. | cboSolicitacoes.ListCount = 0 | WARN | IF_STATEMENT | ready |
| BR-SM-001 | SolicitacoesPossiveis consolidates 6 stored-procedure results into UI-facing state/options — state machine | state consolidation over: stu_sp_validTipodePermissao, stu_sp_list_permissao, stu_sp_list_veiculopermis, stu_sp_list_rotinas_modulo, stu_sp_list_solicitacoes_possiveis, stu_sp_solicitacoes_ativas | WARN | STATE_MACHINE | **NEEDS REVIEW** |
