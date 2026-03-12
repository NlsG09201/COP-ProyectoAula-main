package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "CITAS")
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Cita", columnDefinition = "INT UNSIGNED")
    private Long idCita;

    @Column(name = "Fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "Hora", nullable = false)
    private LocalTime hora;

    @Column(name = "Direccion", nullable = true)
    private String direccion;

    @ManyToOne
    @JoinColumn(name = "ID_Paciente", nullable = false, columnDefinition = "INT UNSIGNED")
    private Persona paciente;

    @ManyToOne
    @JoinColumn(name = "ID_Medico", nullable = true, columnDefinition = "INT UNSIGNED")
    private Persona medico;

    @ManyToOne
    // añadimos el servicio como llave foránea adicional; la tabla SQL creada por JPA
    // usa ID_Servicio, por lo que la consulta manual también deberá incluirla.
    @JoinColumn(name = "ID_Servicio", nullable = false, columnDefinition = "INT UNSIGNED")
    private Servicio servicio;

    @Column(name = "Estado", nullable = true)
    private String estado;

    @Column(name = "Confirmado", nullable = true)
    private Boolean confirmado;

    public Cita() {}

    public Cita(LocalDate fecha, LocalTime hora, String direccion, Persona paciente, Persona medico, Servicio servicio) {
        this.fecha = fecha;
        this.hora = hora;
        this.direccion = direccion;
        this.paciente = paciente;
        this.medico = medico;
        this.servicio = servicio;
    }

    public Long getIdCita() { return idCita; }
    public void setIdCita(Long idCita) { this.idCita = idCita; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public Persona getPaciente() { return paciente; }
    public void setPaciente(Persona paciente) { this.paciente = paciente; }
    public Persona getMedico() { return medico; }
    public void setMedico(Persona medico) { this.medico = medico; }
    public Servicio getServicio() { return servicio; }
    public void setServicio(Servicio servicio) { this.servicio = servicio; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Boolean getConfirmado() { return confirmado; }
    public void setConfirmado(Boolean confirmado) { this.confirmado = confirmado; }
}
