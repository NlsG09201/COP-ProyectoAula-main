package com.ProyectoAula.Backend.mongo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "dientes")
public class DienteDoc {
    @Id
    private String id;
    private String codigoFDI;
    private String nombre;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCodigoFDI() { return codigoFDI; }
    public void setCodigoFDI(String codigoFDI) { this.codigoFDI = codigoFDI; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
