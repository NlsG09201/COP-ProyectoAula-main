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
        if (testInsert) {
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

        if (generateCitasCount > 0) {
            try {
                ResponseEntity<List> pacientesResp = restTemplate.getForEntity(backendBaseUrl + "/pacientes", List.class);
                ResponseEntity<List> serviciosResp = restTemplate.getForEntity(backendBaseUrl + "/servicios", List.class);
                List<?> pacientes = pacientesResp.getBody() != null ? pacientesResp.getBody() : List.of();
                List<?> servicios = serviciosResp.getBody() != null ? serviciosResp.getBody() : List.of();
                if (pacientes.isEmpty() || servicios.isEmpty()) {
                    log.warn("[GEN Citas] Sin pacientes o servicios disponibles");
                    return;
                }
                ArrayList<String> horas = new ArrayList<>();
                for (int h = 8; h <= 17; h++) {
                    for (int m = 0; m < 60; m += 30) {
                        String hh = String.format("%02d", h);
                        String mm = String.format("%02d", m);
                        horas.add(hh + ":" + mm + ":00");
                    }
                }
                Random rnd = new Random(1001);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                int creadas = 0;
                for (int i = 0; i < generateCitasCount; i++) {
                    Object p = pacientes.get(rnd.nextInt(pacientes.size()));
                    Object s = servicios.get(rnd.nextInt(servicios.size()));
                    Number pid = (Number)((Map<?,?>)p).get("idPersona");
                    Number sid = (Number)((Map<?,?>)s).get("idServicio");
                    LocalDate fecha = LocalDate.now().plusDays(rnd.nextInt(60));
                    String hora = horas.get(rnd.nextInt(horas.size()));
                    String body = "{" +
                            "\"fecha\":\"" + fecha.toString() + "\"," +
                            "\"hora\":\"" + hora + "\"," +
                            "\"direccion\":\"Clinica COP\"," +
                            "\"paciente\":{\"idPersona\":" + pid.longValue() + "}," +
                            "\"servicio\":{\"idServicio\":" + sid.longValue() + "}" +
                            "}";
                    try {
                        HttpEntity<String> entity = new HttpEntity<>(body, headers);
                        ResponseEntity<Map> resp = restTemplate.postForEntity(backendBaseUrl + "/citas", entity, Map.class);
                        if (resp.getStatusCode().is2xxSuccessful()) creadas++;
                    } catch (Exception ex) {
                        // continuar
                    }
                }
                log.info("[GEN Citas] Creadas {} citas via Backend", creadas);
            } catch (Exception ex) {
                log.error("[GEN Citas] Error generando citas: {}", ex.getMessage());
            }
        }
    }
}
