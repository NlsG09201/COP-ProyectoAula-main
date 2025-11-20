package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.Testimonio;
import com.ProyectoAula.Backend.repository.TestimonioRepository;
import com.ProyectoAula.Backend.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TestimonioService {

    @Autowired
    private TestimonioRepository testimonioRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Transactional
    public Testimonio crearTestimonio(Testimonio testimonio) {
        // Validar la calificación
        if (testimonio.getCalificacion() < 1 || testimonio.getCalificacion() > 5) {
            throw new IllegalArgumentException("La calificación debe estar entre 1 y 5 estrellas");
        }

        // Validar que el servicio existe
        if (testimonio.getServicio() != null && testimonio.getServicio().getIdServicio() != null) {
            servicioRepository.findById(testimonio.getServicio().getIdServicio())
                .orElseThrow(() -> new IllegalArgumentException("El servicio especificado no existe"));
        }

        // Establecer la fecha de creación
        testimonio.setFechaCreacion(LocalDateTime.now());
        
        return testimonioRepository.save(testimonio);
    }

    public List<Testimonio> obtenerTodosTestimonios() {
        return testimonioRepository.findAll();
    }

    public Optional<Testimonio> obtenerTestimonioPorId(Long id) {
        return testimonioRepository.findById(id);
    }

    public List<Testimonio> obtenerTestimoniosPorServicio(Long servicioId) {
        return testimonioRepository.findByServicioIdServicio(servicioId);
    }

    public Double obtenerPromedioCalificacionServicio(Long servicioId) {
        return testimonioRepository.getPromedioCalificacionByServicioId(servicioId);
    }

    public List<Testimonio> obtenerUltimosTestimonios() {
        return testimonioRepository.findTop5ByOrderByFechaCreacionDesc();
    }

    @Transactional
    public Testimonio actualizarTestimonio(Long id, Testimonio testimonioActualizado) {
        return testimonioRepository.findById(id)
            .map(testimonio -> {
                testimonio.setNombre(testimonioActualizado.getNombre());
                testimonio.setComentario(testimonioActualizado.getComentario());
                testimonio.setCalificacion(testimonioActualizado.getCalificacion());
                if (testimonioActualizado.getServicio() != null) {
                    testimonio.setServicio(testimonioActualizado.getServicio());
                }
                return testimonioRepository.save(testimonio);
            })
            .orElseThrow(() -> new IllegalArgumentException("Testimonio no encontrado con id: " + id));
    }

    @Transactional
    public void eliminarTestimonio(Long id) {
        testimonioRepository.deleteById(id);
    }
}