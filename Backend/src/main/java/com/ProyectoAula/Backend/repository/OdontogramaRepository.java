package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.Odontograma;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OdontogramaRepository extends JpaRepository<Odontograma, Long> {
    List<Odontograma> findByPaciente_IdPersonaOrderByFechaRegistroDesc(Long idPersona);
}
