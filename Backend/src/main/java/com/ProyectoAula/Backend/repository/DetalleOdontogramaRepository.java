package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.DetalleOdontograma;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DetalleOdontogramaRepository extends JpaRepository<DetalleOdontograma, Long> {
    List<DetalleOdontograma> findByOdontograma_IdOdontograma(Long idOdontograma);
}
