package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Odontograma;
import com.ProyectoAula.Backend.repository.OdontogramaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/odontogramas")
@CrossOrigin(origins = "*")
public class OdontogramaController {

    private final OdontogramaRepository repo;

    public OdontogramaController(OdontogramaRepository repo) {
        this.repo = repo;
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