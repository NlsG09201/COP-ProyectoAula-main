package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idServicio;

    @ManyToOne
    @JoinColumn(name = "ID_TipoServicio", nullable = false)
    private TipoServicio tipoServicio;

    @ManyToMany(mappedBy = "servicios")
    private List<Persona> medicos;

    @OneToMany(mappedBy = "servicio")
    private List<Cita> citas;

    // Getters y Setters
    public Long getIdServicio() { return idServicio; }
    public void setIdServicio(Long idServicio) { this.idServicio = idServicio; }
    public TipoServicio getTipoServicio() { return tipoServicio; }
    public void setTipoServicio(TipoServicio tipoServicio) { this.tipoServicio = tipoServicio; }
    
    // Getters y setters para las relaciones
    public List<Persona> getMedicos() { return medicos; }
    public void setMedicos(List<Persona> medicos) { this.medicos = medicos; }
    
    public List<Cita> getCitas() { return citas; }
    public void setCitas(List<Cita> citas) { this.citas = citas; }
}