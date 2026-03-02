package com.ProyectoAula.Worker.mongo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.Random;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Component
public class StartupDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(StartupDataLoader.class);

    private final ReminderLogRepository repository;
    private final RestTemplate restTemplate;

    @Value("${worker.mongo.testInsert:false}")
    private boolean testInsert;

    @Value("${worker.backend.base-url:http://localhost:8080/api}")
    private String backendBaseUrl;

    @Value("${worker.generate.citas.count:0}")
    private int generateCitasCount;

    public StartupDataLoader(ReminderLogRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("Worker iniciado correctamente. Esperando tareas...");
        // Se ha eliminado la generación automática de datos de prueba.
    }
}
