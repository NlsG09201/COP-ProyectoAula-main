package com.ProyectoAula.Worker.dto;

public record ServicioDto(
        Long idServicio,
        String tipoServicio
) {

    public Object nombre() {
        return tipoServicio;
    }}