package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.Servicio;
import com.ProyectoAula.Backend.model.TipoServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    Servicio findByTipoServicio(TipoServicio tipoServicio);

    List<Servicio> findByTipoServicio_NombreContainingIgnoreCase(String nombre);

    Optional<Servicio> findByNombre(String nombre);
}
