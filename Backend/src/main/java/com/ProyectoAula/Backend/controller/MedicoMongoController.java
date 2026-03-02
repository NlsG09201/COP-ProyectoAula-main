package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.mongo.model.PersonaDoc;
import com.ProyectoAula.Backend.mongo.repository.PersonaMongoRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
@Profile("mongo")
public class MedicoMongoController {

    private final PersonaMongoRepository repo;

    public MedicoMongoController(PersonaMongoRepository repo) { this.repo = repo; }

    @GetMapping
    public List<PersonaDoc> listar() { return repo.findByRol(PersonaDoc.Rol.MEDICO); }

    @GetMapping("/{id}")
    public PersonaDoc obtener(@PathVariable String id) {
        PersonaDoc p = repo.findById(id).orElseThrow(() -> new RuntimeException("Médico no encontrado"));
        if (p.getRol() != PersonaDoc.Rol.MEDICO) throw new RuntimeException("No es un médico");
        return p;
    }

    @PostMapping
    public PersonaDoc crear(@RequestBody PersonaDoc medico) {
        medico.setRol(PersonaDoc.Rol.MEDICO);
        return repo.save(medico);
    }

    @PutMapping("/{id}")
    public PersonaDoc actualizar(@PathVariable String id, @RequestBody PersonaDoc datos) {
        PersonaDoc m = repo.findById(id).orElseThrow(() -> new RuntimeException("Médico no encontrado"));
        if (datos.getNombreCompleto() != null) m.setNombreCompleto(datos.getNombreCompleto());
        if (datos.getTelefono() != null) m.setTelefono(datos.getTelefono());
        if (datos.getEmail() != null) m.setEmail(datos.getEmail());
        if (datos.getCertificado() != null) m.setCertificado(datos.getCertificado());
        if (datos.getHoraInicioDisponibilidad() != null) m.setHoraInicioDisponibilidad(datos.getHoraInicioDisponibilidad());
        if (datos.getHoraFinDisponibilidad() != null) m.setHoraFinDisponibilidad(datos.getHoraFinDisponibilidad());
        if (datos.getDiasDisponibles() != null) m.setDiasDisponibles(datos.getDiasDisponibles());
        return repo.save(m);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable String id) { repo.deleteById(id); }
}
