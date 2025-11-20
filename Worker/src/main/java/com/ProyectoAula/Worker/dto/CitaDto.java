package com.ProyectoAula.Worker.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record CitaDto(
        Long idCita,
        LocalDate fecha,
        LocalTime hora,
        String direccion,
        PacienteDto paciente,
        MedicoDto medico,
        ServicioDto servicio
) {}