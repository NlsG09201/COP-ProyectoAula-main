package com.ProyectoAula.Worker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PacienteDto(
        @JsonProperty("idPersona") Long idP,
        String docIden,
        String nombreCompleto,
        String telefono,
        String email,
        String direccion
) {}