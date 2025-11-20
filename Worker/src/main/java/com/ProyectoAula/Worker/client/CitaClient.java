package com.ProyectoAula.Worker.client;

import com.ProyectoAula.Worker.dto.CitaDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Component
public class CitaClient {

    private static final Logger log = LoggerFactory.getLogger(CitaClient.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public CitaClient(RestTemplate restTemplate,
                      @Value("${worker.backend.base-url:http://localhost:8080/api}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public List<CitaDto> listarCitas() {
        try {
            ResponseEntity<List<CitaDto>> resp = restTemplate.exchange(
                    baseUrl + "/citas",
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<CitaDto>>() {}
            );
            return resp.getBody() != null ? resp.getBody() : Collections.emptyList();
        } catch (Exception ex) {
            log.error("Error consultando citas desde Backend: {}", ex.getMessage(), ex);
            return Collections.emptyList();
        }
    }
}