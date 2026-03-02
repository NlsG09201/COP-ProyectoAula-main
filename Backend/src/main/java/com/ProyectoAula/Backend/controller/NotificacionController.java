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
                    // MailHog v2: Content -> Headers -> Subject es un array de strings
                    JsonNode headers = it.path("Content").path("Headers");
                    JsonNode subjNode = headers.path("Subject");
                    if (subjNode.isArray() && subjNode.size() > 0) {
                        subj = subjNode.get(0).asText("");
                    } else if (subjNode.isTextual()) {
                        subj = subjNode.asText("");
                    }
                    
                    String created = it.path("Created").asText("");
                    
                    // Extraer 'From' y 'To' de forma más robusta
                    String from = it.path("Raw").path("From").asText("");
                    if (from.isEmpty()) from = it.path("From").path("Mailbox").asText("") + "@" + it.path("From").path("Domain").asText("");
                    
                    List<String> tos = new ArrayList<>();
                    JsonNode toArr = it.path("Raw").path("To");
                    if (toArr.isArray()) {
                        for (JsonNode t : toArr) tos.add(t.asText(""));
                    } else {
                        JsonNode toList = it.path("To");
                        if (toList.isArray()) {
                            for (JsonNode t : toList) {
                                String m = t.path("Mailbox").asText("");
                                String d = t.path("Domain").asText("");
                                if (!m.isEmpty()) tos.add(m + "@" + d);
                            }
                        }
                    }

                    if (to != null && !to.isBlank()) {
                        final String filterTo = to.trim().toLowerCase();
                        boolean match = tos.stream().anyMatch(x -> x != null && x.toLowerCase().contains(filterTo));
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
