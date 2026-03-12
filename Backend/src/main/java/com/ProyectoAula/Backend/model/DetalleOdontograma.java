package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "DETALLE_ODONTOGRAMA")
public class DetalleOdontograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Detalle", columnDefinition = "INT UNSIGNED")
    private Long idDetalle;

    @ManyToOne
    @JoinColumn(name = "ID_Odontograma", nullable = false, columnDefinition = "INT UNSIGNED")
    @JsonIgnore
    private Odontograma odontograma;

    @ManyToOne
    @JoinColumn(name = "ID_Diente", nullable = false, columnDefinition = "INT UNSIGNED")
    private Diente diente;

    @Column(name = "Estado", nullable = false)
    private String estado;

    @Column(name = "Observacion", columnDefinition = "TEXT")
    private String observacion;

    public Long getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(Long idDetalle) {
        this.idDetalle = idDetalle;
    }

    public Odontograma getOdontograma() {
        return odontograma;
    }

    public void setOdontograma(Odontograma odontograma) {
        this.odontograma = odontograma;
    }

    public Diente getDiente() {
        return diente;
    }

    public void setDiente(Diente diente) {
        this.diente = diente;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }
}