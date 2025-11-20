package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Testimonio;
import com.ProyectoAula.Backend.service.TestimonioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonios")
@CrossOrigin(origins = "*")
public class TestimonioController {

    @Autowired
    private TestimonioService testimonioService;

    @PostMapping
    public ResponseEntity<Testimonio> crearTestimonio(@RequestBody Testimonio testimonio) {
        Testimonio nuevoTestimonio = testimonioService.crearTestimonio(testimonio);
        return ResponseEntity.ok(nuevoTestimonio);
    }

    @GetMapping
    public ResponseEntity<List<Testimonio>> obtenerTodosTestimonios() {
        List<Testimonio> testimonios = testimonioService.obtenerTodosTestimonios();
        return ResponseEntity.ok(testimonios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Testimonio> obtenerTestimonioPorId(@PathVariable Long id) {
        return testimonioService.obtenerTestimonioPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/servicio/{servicioId}")
    public ResponseEntity<List<Testimonio>> obtenerTestimoniosPorServicio(@PathVariable Long servicioId) {
        List<Testimonio> testimonios = testimonioService.obtenerTestimoniosPorServicio(servicioId);
        return ResponseEntity.ok(testimonios);
    }

    @GetMapping("/servicio/{servicioId}/promedio")
    public ResponseEntity<Double> obtenerPromedioCalificacionServicio(@PathVariable Long servicioId) {
        Double promedio = testimonioService.obtenerPromedioCalificacionServicio(servicioId);
        return ResponseEntity.ok(promedio != null ? promedio : 0.0);
    }

    @GetMapping("/ultimos")
    public ResponseEntity<List<Testimonio>> obtenerUltimosTestimonios() {
        List<Testimonio> testimonios = testimonioService.obtenerUltimosTestimonios();
        return ResponseEntity.ok(testimonios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Testimonio> actualizarTestimonio(
            @PathVariable Long id,
            @RequestBody Testimonio testimonioActualizado) {
        try {
            Testimonio testimonio = testimonioService.actualizarTestimonio(id, testimonioActualizado);
            return ResponseEntity.ok(testimonio);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTestimonio(@PathVariable Long id) {
        testimonioService.eliminarTestimonio(id);
        return ResponseEntity.ok().build();
    }
}