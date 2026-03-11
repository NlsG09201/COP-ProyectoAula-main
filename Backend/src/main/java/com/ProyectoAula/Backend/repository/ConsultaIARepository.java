package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.ConsultaIA;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaIARepository extends JpaRepository<ConsultaIA, Long> {
    List<ConsultaIA> findByClienteUsernameOrderByFechaHoraDesc(String clienteUsername);
}

