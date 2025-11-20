package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.Testimonio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TestimonioRepository extends JpaRepository<Testimonio, Long> {
    
    // Buscar testimonios por servicio
    List<Testimonio> findByServicioIdServicio(Long servicioId);
    
    // Obtener promedio de calificación por servicio
    @Query("SELECT AVG(t.calificacion) FROM Testimonio t WHERE t.servicio.idServicio = :servicioId")
    Double getPromedioCalificacionByServicioId(@Param("servicioId") Long servicioId);
    
    // Obtener los últimos N testimonios
    List<Testimonio> findTop5ByOrderByFechaCreacionDesc();
}