package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.mongo.model.DienteDoc;
import com.ProyectoAula.Backend.mongo.repository.DienteMongoRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dientes")
@CrossOrigin(origins = "*")
@Profile("mongo")
public class DienteMongoController {

    private final DienteMongoRepository repo;

    public DienteMongoController(DienteMongoRepository repo) { this.repo = repo; }

    @GetMapping
    public List<DienteDoc> listar() { return repo.findAll(); }

    @GetMapping("/{id}")
    public DienteDoc obtener(@PathVariable String id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Diente no encontrado"));
    }

    @PostMapping
    public DienteDoc crear(@RequestBody DienteDoc diente) { return repo.save(diente); }

    @PutMapping("/{id}")
    public DienteDoc actualizar(@PathVariable String id, @RequestBody DienteDoc datos) {
        DienteDoc d = repo.findById(id).orElseThrow(() -> new RuntimeException("Diente no encontrado"));
        d.setCodigoFDI(datos.getCodigoFDI());
        d.setNombre(datos.getNombre());
        return repo.save(d);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable String id) { repo.deleteById(id); }
}
