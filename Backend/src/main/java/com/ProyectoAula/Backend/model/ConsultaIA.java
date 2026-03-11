package com.ProyectoAula.Backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CONSULTAS_IA")
public class ConsultaIA {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConsulta;

    private String agente;

    @Column(length = 4000)
    private String pregunta;

    @Column(length = 4000)
    private String respuesta;

    private String clienteUsername;

    private LocalDateTime fechaHora;

    private Integer tokensAproximados;

    private String estado;

    public Long getIdConsulta() { return idConsulta; }
    public void setIdConsulta(Long idConsulta) { this.idConsulta = idConsulta; }
    public String getAgente() { return agente; }
    public void setAgente(String agente) { this.agente = agente; }
    public String getPregunta() { return pregunta; }
    public void setPregunta(String pregunta) { this.pregunta = pregunta; }
    public String getRespuesta() { return respuesta; }
    public void setRespuesta(String respuesta) { this.respuesta = respuesta; }
    public String getClienteUsername() { return clienteUsername; }
    public void setClienteUsername(String clienteUsername) { this.clienteUsername = clienteUsername; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
    public Integer getTokensAproximados() { return tokensAproximados; }
    public void setTokensAproximados(Integer tokensAproximados) { this.tokensAproximados = tokensAproximados; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}

