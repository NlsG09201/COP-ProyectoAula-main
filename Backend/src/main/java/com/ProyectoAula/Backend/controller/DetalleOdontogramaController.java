package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.DetalleOdontograma;
import com.ProyectoAula.Backend.repository.DetalleOdontogramaRepository;
import com.ProyectoAula.Backend.repository.DienteRepository;
import com.ProyectoAula.Backend.repository.OdontogramaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/detalles-odontograma")
@CrossOrigin(origins = "*")
public class DetalleOdontogramaController {

    private final DetalleOdontogramaRepository repo;
    private final DienteRepository dienteRepo;
    private final OdontogramaRepository odontogramaRepo;

    public DetalleOdontogramaController(
            DetalleOdontogramaRepository repo,
            DienteRepository dienteRepo,
            OdontogramaRepository odontogramaRepo) {
        this.repo = repo;
        this.dienteRepo = dienteRepo;
        this.odontogramaRepo = odontogramaRepo;
    }

    @GetMapping
    public List<DetalleOdontograma> listar() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public DetalleOdontograma obtener(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Detalle no encontrado"));
    }

    @PostMapping
    public DetalleOdontograma crear(@RequestBody DetalleOdontograma detalle) {
        // Validar relaciones
        if (detalle.getDiente() != null && detalle.getDiente().getIdDiente() != null) {
            var diente = dienteRepo.findById(detalle.getDiente().getIdDiente())
                    .orElseThrow(() -> new RuntimeException("Diente no encontrado"));
            detalle.setDiente(diente);
        }

        if (detalle.getOdontograma() != null && detalle.getOdontograma().getIdOdontograma() != null) {
            var odontograma = odontogramaRepo.findById(detalle.getOdontograma().getIdOdontograma())
                    .orElseThrow(() -> new RuntimeException("Odontograma no encontrado"));
            detalle.setOdontograma(odontograma);
        }

        return repo.save(detalle);
    }

    @PutMapping("/{id}")
    public DetalleOdontograma actualizar(@PathVariable Long id, @RequestBody DetalleOdontograma datos) {
        DetalleOdontograma d = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado"));
        d.setEstado(datos.getEstado());
        d.setObservacion(datos.getObservacion());
        return repo.save(d);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}