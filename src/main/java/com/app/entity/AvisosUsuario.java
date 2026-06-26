package com.app.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "avisos_usuario")
@Getter
@Setter
@NoArgsConstructor
public class AvisosUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String mensagem;

    @Column
    private String perfil;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime data;

    @Column
    private Integer itemIs;

    @Column
    private String validado;

    @Column
    private String ignorar;

    @Column
    private String lancado;

    @Column
    private String ignorarChefia;

}
