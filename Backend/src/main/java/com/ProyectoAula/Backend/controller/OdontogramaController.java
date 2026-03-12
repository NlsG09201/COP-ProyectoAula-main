package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Odontograma;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.repository.OdontogramaRepository;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Objects;

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
        return repo.findById(Objects.requireNonNull(id, "ID es obligatorio")).orElseThrow(() -> new RuntimeException("Odontograma no encontrado"));
    }

    @GetMapping("/paciente/{idPersona}")
    public List<Odontograma> historialPorPaciente(@PathVariable Long idPersona) {
        return repo.findByPaciente_IdPersonaOrderByFechaRegistroDesc(idPersona);
    }

    @PostMapping
    public Odontograma crear(@RequestBody Odontograma odontograma) {
        if (odontograma.getPaciente() == null || odontograma.getPaciente().getIdPersona() == null) {
            throw new RuntimeException("Paciente es obligatorio");
        }
        Long idPaciente = Objects.requireNonNull(odontograma.getPaciente().getIdPersona(),
                "Paciente es obligatorio");
        Persona p = personaRepo.findById(idPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        odontograma.setPaciente(p);
        odontograma.setPaciente(p);

        // Asegurar que cada detalle tenga la referencia al odontograma (necesario para JPA bidirectional)
        if (odontograma.getDetalles() != null) {
            odontograma.getDetalles().forEach(detalle -> {
                detalle.setOdontograma(odontograma);
            });
        }

        return repo.save(odontograma);
    }

    @PutMapping("/{id}")
    public Odontograma actualizar(@PathVariable Long id, @RequestBody Odontograma datos) {
        Odontograma o = repo.findById(Objects.requireNonNull(id, "ID es obligatorio")).orElseThrow(() -> new RuntimeException("Odontograma no encontrado"));
        o.setFechaRegistro(datos.getFechaRegistro());
        o.setObservacionesGenerales(datos.getObservacionesGenerales());
        
        if (datos.getDetalles() != null) {
            // Limpiar detalles anteriores y agregar nuevos
            o.getDetalles().clear();
            datos.getDetalles().forEach(detalle -> {
                detalle.setOdontograma(o);
                o.getDetalles().add(detalle);
            });
        }
        
        return repo.save(o);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(Objects.requireNonNull(id, "ID es obligatorio"));
    }
}
