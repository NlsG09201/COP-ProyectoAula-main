package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TIPOSERVICIO")
public class TipoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TipoServicio", columnDefinition = "INT UNSIGNED")
    private Long idTipoServicio;

    @Column(name = "Nombre")
    private String nombre;

    public Long getIdTipoServicio() { return idTipoServicio; }
    public void setIdTipoServicio(Long idTipoServicio) { this.idTipoServicio = idTipoServicio; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String name() {
        return null;
    }
}