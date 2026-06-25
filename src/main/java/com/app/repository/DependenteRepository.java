package com.app.repository;

import com.app.entity.Dependente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DependenteRepository extends JpaRepository<Dependente, Long> {
}
