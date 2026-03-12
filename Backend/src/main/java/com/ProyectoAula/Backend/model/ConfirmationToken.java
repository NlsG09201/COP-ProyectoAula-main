package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CONFIRMATION_TOKEN")
public class ConfirmationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", columnDefinition = "INT UNSIGNED")
    private Long id;

    @Column(name = "Token", unique = true, nullable = false)
    private String token;

    @Column(name = "ExpiresAt")
    private LocalDateTime expiresAt;

    @Column(name = "Used")
    private boolean used;

    @ManyToOne
    @JoinColumn(name = "ID_Cita", nullable = false, columnDefinition = "INT UNSIGNED")
    private Cita cita;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
    public Cita getCita() { return cita; }
    public void setCita(Cita cita) { this.cita = cita; }
}
