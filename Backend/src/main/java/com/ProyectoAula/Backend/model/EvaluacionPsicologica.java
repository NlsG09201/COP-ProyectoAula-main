package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class EvaluacionPsicologica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEvaluacion;

    private String tipo;
    private Integer puntaje;
    private LocalDate fecha;
    @Column(length = 4000)
    private String respuestasJson;
    @Column(length = 1000)
    private String notas;

    @ManyToOne
    @JoinColumn(name = "ID_Paciente", nullable = false)
    private Persona paciente;

    public Long getIdEvaluacion() { return idEvaluacion; }
    public void setIdEvaluacion(Long idEvaluacion) { this.idEvaluacion = idEvaluacion; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Integer getPuntaje() { return puntaje; }
    public void setPuntaje(Integer puntaje) { this.puntaje = puntaje; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public String getRespuestasJson() { return respuestasJson; }
    public void setRespuestasJson(String respuestasJson) { this.respuestasJson = respuestasJson; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public Persona getPaciente() { return paciente; }
    public void setPaciente(Persona paciente) { this.paciente = paciente; }
}
