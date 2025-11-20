package com.ProyectoAula.Worker.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderLogRepository extends MongoRepository<ReminderLog, String> {
    List<ReminderLog> findByCitaId(Long citaId);
}