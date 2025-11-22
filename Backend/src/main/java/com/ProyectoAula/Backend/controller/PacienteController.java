package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Persona.Rol;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PersonaRepository repo;

    public PacienteController(PersonaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Persona> listar() {
        return repo.findByRol(Rol.PACIENTE);
    }

    @GetMapping("/by-doc/{doc}")
    public Persona obtenerPorDocumento(@PathVariable String doc) {
        Persona p = repo.findByDocIden(doc).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        if (p.getRol() != Rol.PACIENTE) throw new RuntimeException("No es un paciente");
        return p;
    }

    @GetMapping("/{id}")
    public Persona obtener(@PathVariable Long id) {
        Persona p = repo.findById(id).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        if (p.getRol() != Rol.PACIENTE) throw new RuntimeException("No es un paciente");
        return p;
    }

    @PostMapping
    public Persona crear(@RequestBody Persona paciente) {
        paciente.setRol(Rol.PACIENTE);
        String doc = paciente.getDocIden();
        if (doc != null && !doc.isBlank()) {
            var existente = repo.findByDocIden(doc);
            if (existente.isPresent()) { throw new RuntimeException("Documento de identidad ya registrado"); }
        }
        return repo.save(paciente);
    }

    @PutMapping("/{id}")
    public Persona actualizar(@PathVariable Long id, @RequestBody Persona datos) {
        Persona p = repo.findById(id).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        p.setNombreCompleto(datos.getNombreCompleto());
        p.setTelefono(datos.getTelefono());
        p.setEmail(datos.getEmail());
        p.setDireccion(datos.getDireccion());
        String nuevoDoc = datos.getDocIden();
        if (nuevoDoc != null && !nuevoDoc.isBlank() && (p.getDocIden() == null || !p.getDocIden().equals(nuevoDoc))) {
            var existente = repo.findByDocIden(nuevoDoc);
            if (existente.isPresent() && !existente.get().getIdPersona().equals(p.getIdPersona())) {
                throw new RuntimeException("Documento de identidad ya registrado");
            }
            p.setDocIden(nuevoDoc);
        }
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
