package com.ProyectoAula.Backend.mongo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;
import java.util.List;

@Document(collection = "personas")
public class PersonaDoc {
    public enum Rol { MEDICO, PACIENTE, CLIENTE }

    @Id
    private String id;
    @Indexed(unique = true, sparse = true)
    private String docIden;
    private String nombreCompleto;
    private String telefono;
    private String email;
    private String direccion;

    @Indexed(unique = true, sparse = true)
    private String username;
    private String passwordHash;
    private Rol rol;
    private String certificado;
    private LocalTime horaInicioDisponibilidad;
    private LocalTime horaFinDisponibilidad;
    private String diasDisponibles;
    private List<String> servicios; // ids o nombres de servicios asociados

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public List<String> getServicios() { return servicios; }
    public void setServicios(List<String> servicios) { this.servicios = servicios; }
}
