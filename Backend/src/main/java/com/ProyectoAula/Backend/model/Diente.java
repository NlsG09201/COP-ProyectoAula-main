package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "DIENTES")
public class Diente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Diente", columnDefinition = "INT UNSIGNED")
    private Long idDiente;

    @Column(name = "CodigoFDI", nullable = false, unique = true)
    private String codigoFDI;

    @Column(name = "Nombre", nullable = false)
    private String nombre;

    public Long getIdDiente() {
        return idDiente;
    }

    public void setIdDiente(Long idDiente) {
        this.idDiente = idDiente;
    }

    public String getCodigoFDI() {
        return codigoFDI;
    }

    public void setCodigoFDI(String codigoFDI) {
        this.codigoFDI = codigoFDI;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
