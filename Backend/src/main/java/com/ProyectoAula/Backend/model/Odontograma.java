package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "ODONTOGRAMAS")
public class Odontograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOdontograma;

    @Column(nullable = false)
    private LocalDate fechaRegistro;

    @Column(columnDefinition = "TEXT")
    private String observacionesGenerales;

    @ManyToOne
    @JoinColumn(name = "ID_Paciente", nullable = false)
    private Persona paciente;

    @OneToMany(mappedBy = "odontograma", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleOdontograma> detalles;

    public Long getIdOdontograma() {
        return idOdontograma;
    }

    public void setIdOdontograma(Long idOdontograma) {
        this.idOdontograma = idOdontograma;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public String getObservacionesGenerales() {
        return observacionesGenerales;
    }

    public void setObservacionesGenerales(String observacionesGenerales) {
        this.observacionesGenerales = observacionesGenerales;
    }

    public Persona getPaciente() {
        return paciente;
    }

    public void setPaciente(Persona paciente) {
        this.paciente = paciente;
    }

    public List<DetalleOdontograma> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleOdontograma> detalles) {
        this.detalles = detalles;
    }
}