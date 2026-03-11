package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.EvaluacionPsicologica;
import com.ProyectoAula.Backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EvaluacionPsicologicaRepository extends JpaRepository<EvaluacionPsicologica, Long> {
    List<EvaluacionPsicologica> findByPaciente(Persona paciente);
    List<EvaluacionPsicologica> findByTipo(String tipo);
    List<EvaluacionPsicologica> findByFechaBetween(LocalDate desde, LocalDate hasta);
}
