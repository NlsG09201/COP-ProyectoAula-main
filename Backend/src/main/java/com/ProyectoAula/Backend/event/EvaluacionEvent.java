package com.ProyectoAula.Backend.event;

public class EvaluacionEvent {
    private Long pacienteId;
    private String pacienteNombre;
    private String pacienteEmail;
    private String pacienteTelefono;
    private String tipoEvaluacion;
    private Integer puntaje;
    private String notas;

    public EvaluacionEvent() {}

    public EvaluacionEvent(Long pacienteId, String pacienteNombre, String pacienteEmail, String pacienteTelefono,
                           String tipoEvaluacion, Integer puntaje, String notas) {
        this.pacienteId = pacienteId;
        this.pacienteNombre = pacienteNombre;
        this.pacienteEmail = pacienteEmail;
        this.pacienteTelefono = pacienteTelefono;
        this.tipoEvaluacion = tipoEvaluacion;
        this.puntaje = puntaje;
        this.notas = notas;
    }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }
    public String getPacienteNombre() { return pacienteNombre; }
    public void setPacienteNombre(String pacienteNombre) { this.pacienteNombre = pacienteNombre; }
    public String getPacienteEmail() { return pacienteEmail; }
    public void setPacienteEmail(String pacienteEmail) { this.pacienteEmail = pacienteEmail; }
    public String getPacienteTelefono() { return pacienteTelefono; }
    public void setPacienteTelefono(String pacienteTelefono) { this.pacienteTelefono = pacienteTelefono; }
    public String getTipoEvaluacion() { return tipoEvaluacion; }
    public void setTipoEvaluacion(String tipoEvaluacion) { this.tipoEvaluacion = tipoEvaluacion; }
    public Integer getPuntaje() { return puntaje; }
    public void setPuntaje(Integer puntaje) { this.puntaje = puntaje; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
}
