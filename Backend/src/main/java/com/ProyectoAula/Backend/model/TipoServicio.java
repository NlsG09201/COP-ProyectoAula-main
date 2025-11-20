package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;

@Entity
public class TipoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTipoServicio;

    private String nombre;

    public Long getIdTipoServicio() { return idTipoServicio; }
    public void setIdTipoServicio(Long idTipoServicio) { this.idTipoServicio = idTipoServicio; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String name() {
        return null;
    }
}