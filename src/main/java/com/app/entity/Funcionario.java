package com.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "funcionario")
@Getter
@Setter
@NoArgsConstructor
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String nome;

    @Column
    private String nomeGuerra;

    @Column(nullable = false)
    @NotBlank
    private String numeroFuncional;

    @Column
    private String cpf;

    @Column
    private String sexo;

    @Column
    private String fone;

    @Column
    private Integer vinculoValido;

    @Column
    private String celular;

    @Column
    private String email;

    @Column
    private String estadoCivil;

    @Column
    private String grupoSanguineo;

    @Column
    private String racaCor;

    @Column
    private LocalDateTime dataNascimento;

    @Column
    private String cidadeNascimento;

    @Column
    private String ufNascimento;

    @Column
    private String paisNascimento;

    @Column
    private String nacionalidade;

    @Column
    private String nomePai;

    @Column
    private String nomeMae;

    @Column
    private String prontuarioHpm;

    @Column
    private String tipoCadastro;

    @Column
    private String ativo;

    @Column
    private String documentosFuncionario;

    @Column
    private String dadosBancariosFuncionario;

    @Column
    private String historicoProfissional;

    @Column
    private String vestimenta;

    @Column
    private String tamanho;

    @Column
    private String adido;

    @Column
    private String corOlhos;

    @Column
    private String corCabelos;

    @Column
    private String sinaisParticulares;

    @Column
    private String altura;

}
