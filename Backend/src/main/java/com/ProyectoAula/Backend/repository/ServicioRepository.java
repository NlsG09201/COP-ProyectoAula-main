package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.Servicio;
import com.ProyectoAula.Backend.model.TipoServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    Servicio findByTipoServicio(TipoServicio tipoServicio);

    List<Servicio> findByTipoServicio_NombreContainingIgnoreCase(String nombre);
}
