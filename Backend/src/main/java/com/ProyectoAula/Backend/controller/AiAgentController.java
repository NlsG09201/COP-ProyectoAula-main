package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Cita;
import com.ProyectoAula.Backend.service.AiAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiAgentController {

    @Autowired
    private AiAgentService aiAgentService;

    @PostMapping("/schedule")
    public ResponseEntity<List<Cita>> organize(@RequestBody List<Cita> citas) {
        return ResponseEntity.ok(aiAgentService.organizarCitas(citas));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        String message = payload.getOrDefault("message", "");
        String reply = aiAgentService.responder(message);
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}