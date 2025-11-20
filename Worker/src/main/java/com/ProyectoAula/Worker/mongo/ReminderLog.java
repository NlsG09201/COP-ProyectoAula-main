package com.ProyectoAula.Worker.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "reminder_logs")
public class ReminderLog {
    @Id
    private String id;
    private Long citaId;
    private String pacienteNombre;
    private String pacienteEmail;
    private LocalDateTime citaFechaHora;
    private List<String> servicios;
    private String status; // SENT, SKIPPED, ERROR
    private String errorMessage;
    private LocalDateTime createdAt;

    public ReminderLog() {}

    public ReminderLog(Long citaId, String pacienteNombre, String pacienteEmail,
                       LocalDateTime citaFechaHora, List<String> servicios,
                       String status, String errorMessage, LocalDateTime createdAt) {
        this.citaId = citaId;
        this.pacienteNombre = pacienteNombre;
        this.pacienteEmail = pacienteEmail;
        this.citaFechaHora = citaFechaHora;
        this.servicios = servicios;
        this.status = status;
        this.errorMessage = errorMessage;
        this.createdAt = createdAt;
    }

    // getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getCitaId() { return citaId; }
    public void setCitaId(Long citaId) { this.citaId = citaId; }
    public String getPacienteNombre() { return pacienteNombre; }
    public void setPacienteNombre(String pacienteNombre) { this.pacienteNombre = pacienteNombre; }
    public String getPacienteEmail() { return pacienteEmail; }
    public void setPacienteEmail(String pacienteEmail) { this.pacienteEmail = pacienteEmail; }
    public LocalDateTime getCitaFechaHora() { return citaFechaHora; }
    public void setCitaFechaHora(LocalDateTime citaFechaHora) { this.citaFechaHora = citaFechaHora; }
    public List<String> getServicios() { return servicios; }
    public void setServicios(List<String> servicios) { this.servicios = servicios; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}