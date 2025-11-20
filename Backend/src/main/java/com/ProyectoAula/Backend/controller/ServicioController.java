package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Servicio;
import com.ProyectoAula.Backend.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    private final ServicioRepository repo;

    public ServicioController(ServicioRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Servicio> listar() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Servicio obtener(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }

    @PostMapping
    public Servicio crear(@RequestBody Servicio servicio) {
        return repo.save(servicio);
    }

    @PutMapping("/{id}")
    public Servicio actualizar(@PathVariable Long id, @RequestBody Servicio datos) {
        Servicio s = repo.findById(id).orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        s.setTipoServicio(datos.getTipoServicio());
        return repo.save(s);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}