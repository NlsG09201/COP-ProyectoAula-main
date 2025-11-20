package com.ProyectoAula.Worker.mongo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class StartupDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(StartupDataLoader.class);

    private final ReminderLogRepository repository;

    @Value("${worker.mongo.testInsert:false}")
    private boolean testInsert;

    public StartupDataLoader(ReminderLogRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (!testInsert) {
            return;
        }
        try {
            ReminderLog doc = new ReminderLog(
                    System.currentTimeMillis(),
                    "Tester",
                    "tester@example.com",
                    LocalDateTime.now().plusDays(1),
                    List.of("Consulta", "Limpieza"),
                    "TEST",
                    null,
                    LocalDateTime.now()
            );
            ReminderLog saved = repository.save(doc);
            log.info("[Mongo TEST] Insertado documento de prueba en reminder_logs con id={}", saved.getId());
        } catch (Exception ex) {
            log.error("[Mongo TEST] Error insertando documento de prueba: {}", ex.getMessage());
        }
    }
}