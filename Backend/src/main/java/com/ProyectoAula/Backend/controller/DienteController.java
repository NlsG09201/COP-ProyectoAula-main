package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Diente;
import com.ProyectoAula.Backend.repository.DienteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dientes")
@CrossOrigin(origins = "*")
public class DienteController {

    private final DienteRepository repo;

    public DienteController(DienteRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Diente> listar() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Diente obtener(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Diente no encontrado"));
    }

    @PostMapping
    public Diente crear(@RequestBody Diente diente) {
        return repo.save(diente);
    }

    @PutMapping("/{id}")
    public Diente actualizar(@PathVariable Long id, @RequestBody Diente datos) {
        Diente d = repo.findById(id).orElseThrow(() -> new RuntimeException("Diente no encontrado"));
        d.setCodigoFDI(datos.getCodigoFDI());
        d.setNombre(datos.getNombre());
        return repo.save(d);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}