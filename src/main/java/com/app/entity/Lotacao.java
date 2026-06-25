package com.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "lotacao")
@Getter
@Setter
@NoArgsConstructor
public class Lotacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String funcionarioAuxLookup;

    @Column
    private LocalDateTime dataInicio;

    @Column
    private LocalDateTime dataFim;

    @Column
    private String atual;

    @Column
    private String substituicao;

    @Column
    private String ativo;

    @Column
    private String obs;

}
