package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Odontograma;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.repository.OdontogramaRepository;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/odontogramas")
@CrossOrigin(origins = "*")
public class OdontogramaController {

    private final OdontogramaRepository repo;
    private final PersonaRepository personaRepo;

    public OdontogramaController(OdontogramaRepository repo, PersonaRepository personaRepo) {
        this.repo = repo;
        this.personaRepo = personaRepo;
    }

    @GetMapping
    public List<Odontograma> listar() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Odontograma obtener(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Odontograma no encontrado"));
    }

    @PostMapping
    public Odontograma crear(@RequestBody Odontograma odontograma) {
        if (odontograma.getPaciente() == null || odontograma.getPaciente().getIdPersona() == null) {
            throw new RuntimeException("Paciente es obligatorio");
        }
        Persona p = personaRepo.findById(odontograma.getPaciente().getIdPersona())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        odontograma.setPaciente(p);
        return repo.save(odontograma);
    }

    @PutMapping("/{id}")
    public Odontograma actualizar(@PathVariable Long id, @RequestBody Odontograma datos) {
        Odontograma o = repo.findById(id).orElseThrow(() -> new RuntimeException("Odontograma no encontrado"));
        o.setFechaRegistro(datos.getFechaRegistro());
        o.setObservacionesGenerales(datos.getObservacionesGenerales());
        return repo.save(o);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
