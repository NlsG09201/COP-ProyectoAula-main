package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.Diente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DienteRepository extends JpaRepository<Diente, Long> {

    // Buscar diente por su código FDI (ejemplo: 11, 12, 21...)
    Optional<Diente> findByCodigoFDI(String codigoFDI);

    // Buscar dientes cuyo nombre contenga un texto, ignorando mayúsculas/minúsculas
    List<Diente> findByNombreContainingIgnoreCase(String texto);
}