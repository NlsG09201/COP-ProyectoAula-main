package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.mongo.model.PersonaDoc;
import com.ProyectoAula.Backend.mongo.repository.PersonaMongoRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
@Profile("mongo")
public class PacienteMongoController {

    private final PersonaMongoRepository repo;

    public PacienteMongoController(PersonaMongoRepository repo) { this.repo = repo; }

    @GetMapping
    public List<PersonaDoc> listar() { return repo.findByRol(PersonaDoc.Rol.PACIENTE); }

    @GetMapping("/by-doc/{doc}")
    public PersonaDoc obtenerPorDocumento(@PathVariable String doc) {
        PersonaDoc p = repo.findByDocIden(doc)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente no encontrado"));
        if (p.getRol() != PersonaDoc.Rol.PACIENTE) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No es un paciente");
        return p;
    }

    @GetMapping("/exists/{doc}")
    public Map<String, Boolean> existePorDocumento(@PathVariable String doc) {
        boolean existe = repo.findByDocIden(doc).isPresent();
        return Map.of("exists", existe);
    }

    @GetMapping("/{id}")
    public PersonaDoc obtener(@PathVariable String id) {
        PersonaDoc p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente no encontrado"));
        if (p.getRol() != PersonaDoc.Rol.PACIENTE) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No es un paciente");
        return p;
    }

    @PostMapping
    public PersonaDoc crear(@RequestBody PersonaDoc paciente) {
        if (paciente.getNombreCompleto() == null || paciente.getNombreCompleto().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre completo es obligatorio");
        }
        paciente.setRol(PersonaDoc.Rol.PACIENTE);
        String doc = paciente.getDocIden();
        if (doc != null && !doc.isBlank()) {
            var existente = repo.findByDocIden(doc);
            if (existente.isPresent()) { throw new ResponseStatusException(HttpStatus.CONFLICT, "Documento de identidad ya registrado"); }
        }
        return repo.save(paciente);
    }

    @PutMapping("/{id}")
    public PersonaDoc actualizar(@PathVariable String id, @RequestBody PersonaDoc datos) {
        PersonaDoc p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente no encontrado"));
        p.setNombreCompleto(datos.getNombreCompleto());
        p.setTelefono(datos.getTelefono());
        p.setEmail(datos.getEmail());
        p.setDireccion(datos.getDireccion());
        String nuevoDoc = datos.getDocIden();
        if (nuevoDoc != null && !nuevoDoc.isBlank() && (p.getDocIden() == null || !p.getDocIden().equals(nuevoDoc))) {
            var existente = repo.findByDocIden(nuevoDoc);
            if (existente.isPresent() && !existente.get().getId().equals(p.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Documento de identidad ya registrado");
            }
            p.setDocIden(nuevoDoc);
        }
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable String id) { repo.deleteById(id); }
}
