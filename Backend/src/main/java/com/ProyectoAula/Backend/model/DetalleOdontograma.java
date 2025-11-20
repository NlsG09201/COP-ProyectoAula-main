package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "DETALLE_ODONTOGRAMA")
public class DetalleOdontograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDetalle;

    @ManyToOne
    @JoinColumn(name = "ID_Odontograma", nullable = false)
    private Odontograma odontograma;

    @ManyToOne
    @JoinColumn(name = "ID_Diente", nullable = false)
    private Diente diente;

    @Column(nullable = false)
    private String estado; // Ejemplo: "Cariado", "Obturado", "Sano", etc.

    @Column(columnDefinition = "TEXT")
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