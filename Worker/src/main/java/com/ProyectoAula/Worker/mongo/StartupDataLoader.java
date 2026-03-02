package com.ProyectoAula.Worker.mongo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(StartupDataLoader.class);

    @Override
    public void run(String... args) {
        log.info("Worker iniciado correctamente. Esperando tareas...");
        // Se ha eliminado la generación automática de datos de prueba.
    }
}
