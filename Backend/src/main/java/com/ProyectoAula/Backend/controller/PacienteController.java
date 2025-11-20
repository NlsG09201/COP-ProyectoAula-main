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

    @GetMapping("/{id}")
    public Persona obtener(@PathVariable Long id) {
        Persona p = repo.findById(id).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        if (p.getRol() != Rol.PACIENTE) throw new RuntimeException("No es un paciente");
        return p;
    }

    @PostMapping
    public Persona crear(@RequestBody Persona paciente) {
        paciente.setRol(Rol.PACIENTE);
        return repo.save(paciente);
    }

    @PutMapping("/{id}")
    public Persona actualizar(@PathVariable Long id, @RequestBody Persona datos) {
        Persona p = repo.findById(id).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        p.setNombreCompleto(datos.getNombreCompleto());
        p.setTelefono(datos.getTelefono());
        p.setEmail(datos.getEmail());
        p.setDireccion(datos.getDireccion());
        p.setDocIden(datos.getDocIden());
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}