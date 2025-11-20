package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.Cita;
import com.ProyectoAula.Backend.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByPaciente(Persona paciente);

    List<Cita> findByMedico(Persona medico);

    // 🔹 Buscar citas por fecha
    List<Cita> findByFecha(LocalDate fecha);

    // 🔹 Buscar citas entre dos fechas
    List<Cita> findByFechaBetween(LocalDate inicio, LocalDate fin);
}
