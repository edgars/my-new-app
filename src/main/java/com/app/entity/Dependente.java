package com.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "dependente")
@Getter
@Setter
@NoArgsConstructor
public class Dependente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String nome;

    @Column
    private LocalDateTime dataNascimento;

    @Column
    private String parentesco;

    @Column
    private String cpf;

    @Column
    private String sexo;

    @Column
    private String dadosBancarios;

    @Column
    private String documentos;

    @Column
    private String endereco;

}
