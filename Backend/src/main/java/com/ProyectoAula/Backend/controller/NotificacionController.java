package com.ProyectoAula.Backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import java.util.Collections;
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
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(3000);
        RestTemplate rt = new RestTemplate(factory);
        
        // MailHog v2: Limit results to 50 for performance
        String url = mailhogBase + "/api/v2/messages?limit=50";
        List<Map<String,Object>> out = new ArrayList<>();
        try {
            String json = rt.getForObject(url, String.class);
            if (json == null) return ResponseEntity.ok(new ArrayList<>());
            
            ObjectMapper om = new ObjectMapper();
            JsonNode root = om.readTree(json);
            JsonNode items = root.path("items");
            if (items.isArray()) {
                int count = 0;
                for (JsonNode it : items) {
                    if (count++ > 50) break;
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
