package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Persona.Rol;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    private final PersonaRepository repo;

    public MedicoController(PersonaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Persona> listar() {
        return repo.findByRol(Rol.MEDICO);
    }

    @GetMapping("/por-servicio/{idServicio}")
    public List<Persona> listarPorServicio(@PathVariable Long idServicio) {
        return repo.findByRolAndServicios_Id(Rol.MEDICO, idServicio);
    }

    @GetMapping("/{id}")
    public Persona obtener(@PathVariable Long id) {
        Persona p = repo.findById(id).orElseThrow(() -> new RuntimeException("Médico no encontrado"));
        if (p.getRol() != Rol.MEDICO) throw new RuntimeException("No es un médico");
        return p;
    }

    @PostMapping
    public Persona crear(@RequestBody Persona medico) {
        medico.setRol(Rol.MEDICO);
        return repo.save(medico);
    }

    @PutMapping("/{id}")
    public Persona actualizar(@PathVariable Long id, @RequestBody Persona datos) {
        Persona m = repo.findById(id).orElseThrow(() -> new RuntimeException("Médico no encontrado"));
        m.setNombreCompleto(datos.getNombreCompleto());
        m.setTelefono(datos.getTelefono());
        m.setEmail(datos.getEmail());
        m.setCertificado(datos.getCertificado());
        m.setHoraInicioDisponibilidad(datos.getHoraInicioDisponibilidad());
        m.setHoraFinDisponibilidad(datos.getHoraFinDisponibilidad());
        m.setDiasDisponibles(datos.getDiasDisponibles());
        return repo.save(m);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
