package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.RegistroCobro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistroCobroRepository extends JpaRepository<RegistroCobro, Long> {
    List<RegistroCobro> findByClienteUsernameOrderByFechaHoraDesc(String clienteUsername);
}

