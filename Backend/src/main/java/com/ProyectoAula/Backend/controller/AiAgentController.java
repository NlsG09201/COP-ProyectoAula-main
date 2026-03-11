package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Cita;
import com.ProyectoAula.Backend.service.AiAgentService;
import com.ProyectoAula.Backend.model.ConsultaIA;
import com.ProyectoAula.Backend.model.RegistroCobro;
import com.ProyectoAula.Backend.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiAgentController {

    private final AiAgentService aiAgentService;
    private final BillingService billingService;

    @Autowired
    public AiAgentController(AiAgentService aiAgentService, BillingService billingService) {
        this.aiAgentService = aiAgentService;
        this.billingService = billingService;
    }

    @PostMapping("/schedule")
    public ResponseEntity<List<Cita>> organize(@RequestBody List<Cita> citas) {
        return ResponseEntity.ok(aiAgentService.organizarCitas(citas));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> payload) {
        String message = payload.getOrDefault("message", "");
        String cliente = payload.getOrDefault("clienteUsername", null);
        String agente = payload.getOrDefault("agente", "FAQ");
        ConsultaIA consulta = aiAgentService.responder(message, cliente, agente);
        RegistroCobro cobro = billingService.registrarCobroConsulta(consulta);
        return ResponseEntity.ok(Map.of(
                "reply", consulta.getRespuesta(),
                "consultaId", consulta.getIdConsulta(),
                "monto", cobro.getMonto(),
                "estadoPago", cobro.getEstadoPago()
        ));
    }
}