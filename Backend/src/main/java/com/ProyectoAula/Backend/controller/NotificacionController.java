package com.ProyectoAula.Backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "*")
public class NotificacionController {

    @Value("${MAILHOG_API_BASE:http://localhost:8025}")
    private String mailhogBase;

    @GetMapping
    public ResponseEntity<List<Map<String,Object>>> listar(@RequestParam(required=false) String to) {
        RestTemplate rt = new RestTemplate();
        String url = mailhogBase + "/api/v2/messages";
        String json = rt.getForObject(url, String.class);
        ObjectMapper om = new ObjectMapper();
        List<Map<String,Object>> out = new ArrayList<>();
        try {
            JsonNode root = om.readTree(json);
            JsonNode items = root.path("items");
            if (items.isArray()) {
                for (JsonNode it : items) {
                    String subj = "";
                    JsonNode subjArr = it.path("Content").path("Headers").path("Subject");
                    if (subjArr.isArray() && subjArr.size() > 0) subj = subjArr.get(0).asText("");
                    String created = it.path("Created").asText("");
                    String from = it.path("From").asText("");
                    List<String> tos = new ArrayList<>();
                    JsonNode toArr = it.path("To");
                    if (toArr.isArray()) {
                        for (JsonNode t : toArr) tos.add(t.asText(""));
                    }
                    if (to != null && !to.isBlank()) {
                        boolean match = tos.stream().anyMatch(x -> x != null && x.equalsIgnoreCase(to));
                        if (!match) continue;
                    }
                    out.add(Map.of(
                            "subject", subj,
                            "from", from,
                            "to", tos,
                            "created", created
                    ));
                }
            }
        } catch (Exception ignored) {}
        return ResponseEntity.ok(out);
    }
}
