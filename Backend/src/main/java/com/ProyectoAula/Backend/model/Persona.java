package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Persona {

    public enum Rol { MEDICO, PACIENTE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPersona;

    private String docIden;
    private String nombreCompleto;
    private String telefono;
    private String email;
    private String direccion;

    private String username;
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    private String certificado;

    private LocalTime horaInicioDisponibilidad;
    private LocalTime horaFinDisponibilidad;
    private String diasDisponibles;

    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Cita> citasPaciente;

    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Cita> citasMedico;

    @ManyToMany
    @JoinTable(
            name = "MEDICO_SERVICIO",
            joinColumns = @JoinColumn(name = "ID_Persona"),
            inverseJoinColumns = @JoinColumn(name = "ID_Servicio")
    )
    @JsonIgnore
    private List<Servicio> servicios;

    public Long getIdPersona() { return idPersona; }
    public void setIdPersona(Long idPersona) { this.idPersona = idPersona; }
    public String getDocIden() { return docIden; }
    public void setDocIden(String docIden) { this.docIden = docIden; }
    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
    public String getCertificado() { return certificado; }
    public void setCertificado(String certificado) { this.certificado = certificado; }
    public LocalTime getHoraInicioDisponibilidad() { return horaInicioDisponibilidad; }
    public void setHoraInicioDisponibilidad(LocalTime horaInicioDisponibilidad) { this.horaInicioDisponibilidad = horaInicioDisponibilidad; }
    public LocalTime getHoraFinDisponibilidad() { return horaFinDisponibilidad; }
    public void setHoraFinDisponibilidad(LocalTime horaFinDisponibilidad) { this.horaFinDisponibilidad = horaFinDisponibilidad; }
    public String getDiasDisponibles() { return diasDisponibles; }
    public void setDiasDisponibles(String diasDisponibles) { this.diasDisponibles = diasDisponibles; }
    public List<Cita> getCitasPaciente() { return citasPaciente; }
    public void setCitasPaciente(List<Cita> citasPaciente) { this.citasPaciente = citasPaciente; }
    public List<Cita> getCitasMedico() { return citasMedico; }
    public void setCitasMedico(List<Cita> citasMedico) { this.citasMedico = citasMedico; }
    public List<Servicio> getServicios() { return servicios; }
    public void setServicios(List<Servicio> servicios) { this.servicios = servicios; }
}
