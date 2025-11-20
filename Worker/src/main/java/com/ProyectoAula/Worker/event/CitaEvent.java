package com.ProyectoAula.Worker.event;

import java.time.LocalDate;
import java.time.LocalTime;

public class CitaEvent {
    private Long idCita;
    private LocalDate fecha;
    private LocalTime hora;
    private String direccion;
    private String pacienteNombre;
    private String pacienteEmail;
    private String medicoNombre;
    private String servicioNombre;
    private String tipo;

    public Long getIdCita() { return idCita; }
    public void setIdCita(Long idCita) { this.idCita = idCita; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getPacienteNombre() { return pacienteNombre; }
    public void setPacienteNombre(String pacienteNombre) { this.pacienteNombre = pacienteNombre; }
    public String getPacienteEmail() { return pacienteEmail; }
    public void setPacienteEmail(String pacienteEmail) { this.pacienteEmail = pacienteEmail; }
    public String getMedicoNombre() { return medicoNombre; }
    public void setMedicoNombre(String medicoNombre) { this.medicoNombre = medicoNombre; }
    public String getServicioNombre() { return servicioNombre; }
    public void setServicioNombre(String servicioNombre) { this.servicioNombre = servicioNombre; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}