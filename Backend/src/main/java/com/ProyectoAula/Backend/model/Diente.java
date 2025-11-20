package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "DIENTES")
public class Diente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDiente;

    @Column(nullable = false, unique = true)
    private String codigoFDI;  // Código internacional de diente (ej: 11, 12, 21...)

    @Column(nullable = false)
    private String nombre;     // Ejemplo: Incisivo central superior derecho

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
