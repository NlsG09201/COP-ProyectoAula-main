package com.ProyectoAula.Backend.repository;

import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Persona.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {

    Optional<Persona> findByDocIden(String docIden);

    Optional<Persona> findByEmail(String email);
    Optional<Persona> findByUsername(String username);

    List<Persona> findByRol(Rol rol);

    List<Persona> findByRolAndNombreCompletoContainingIgnoreCase(Rol rol, String nombre);

    List<Persona> findByRolAndServicios_IdServicio(Rol rol, Long idServicio);
}
