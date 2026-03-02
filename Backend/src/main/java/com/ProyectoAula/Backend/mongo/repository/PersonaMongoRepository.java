package com.ProyectoAula.Backend.mongo.repository;

import com.ProyectoAula.Backend.mongo.model.PersonaDoc;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Profile("mongo")
public interface PersonaMongoRepository extends MongoRepository<PersonaDoc, String> {
    Optional<PersonaDoc> findByUsername(String username);
    Optional<PersonaDoc> findByDocIden(String docIden);
    List<PersonaDoc> findByRol(PersonaDoc.Rol rol);
    List<PersonaDoc> findByRolAndServiciosContaining(PersonaDoc.Rol rol, String servicio);
}
