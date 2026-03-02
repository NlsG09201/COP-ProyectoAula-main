package com.ProyectoAula.Backend.mongo.repository;

import com.ProyectoAula.Backend.mongo.model.DienteDoc;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Profile("mongo")
public interface DienteMongoRepository extends MongoRepository<DienteDoc, String> {
    Optional<DienteDoc> findByCodigoFDI(String codigoFDI);
    List<DienteDoc> findByNombreContainingIgnoreCase(String texto);
}
