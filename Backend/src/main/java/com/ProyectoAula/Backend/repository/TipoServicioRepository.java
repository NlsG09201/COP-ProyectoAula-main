package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.TipoServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoServicioRepository extends JpaRepository<TipoServicio, Long> {
    Optional<TipoServicio> findByNombre(String nombre);
}