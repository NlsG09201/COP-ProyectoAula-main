package com.ProyectoAula.Worker.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MedicoDto(
        @JsonProperty("idPersona") Long idMedico,
        String nombreCompleto,
        String telefono,
        String email,
        String certificado
) {}