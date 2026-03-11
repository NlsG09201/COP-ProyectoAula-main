package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.EvaluacionPsicologica;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import com.ProyectoAula.Backend.service.EvaluacionPsicologicaService;
import org.springframework.http.ResponseEntity;
import org.springframework.context.annotation.Profile;
import com.ProyectoAula.Backend.event.EvaluacionEvent;
import com.ProyectoAula.Backend.service.EventPublisher;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@Profile("!mongo")
@RequestMapping("/api/psicologia")
@CrossOrigin(origins = "*")
public class PsicologiaController {
    private final EvaluacionPsicologicaService service;
    private final PersonaRepository personaRepo;
    private final EventPublisher events;

    public PsicologiaController(EvaluacionPsicologicaService service, PersonaRepository personaRepo, EventPublisher events) {
        this.service = service;
        this.personaRepo = personaRepo;
        this.events = events;
    }

    @GetMapping("/evaluaciones")
    public List<EvaluacionPsicologica> listar(@RequestParam(required = false) String tipo,
                                              @RequestParam(required = false) String desde,
                                              @RequestParam(required = false) String hasta) {
        if (desde != null && hasta != null) {
            LocalDate d = LocalDate.parse(desde);
            LocalDate h = LocalDate.parse(hasta);
            List<EvaluacionPsicologica> list = service.findByFechaBetween(d, h);
            if (tipo != null && !tipo.isBlank()) {
                return list.stream().filter(e -> tipo.equalsIgnoreCase(e.getTipo())).toList();
            }
            return list;
        }
        if (tipo != null && !tipo.isBlank()) return service.findByTipo(tipo);
        return service.findAll();
    }

    @GetMapping("/evaluaciones/{id}")
    public EvaluacionPsicologica obtener(@PathVariable Long id) {
        return service.findById(id).orElseThrow(() -> new RuntimeException("Evaluación no encontrada"));
    }

    @GetMapping("/evaluaciones/paciente/{pacienteId}")
    public List<EvaluacionPsicologica> listarPorPaciente(@PathVariable Long pacienteId) {
        Persona p = personaRepo.findById(pacienteId).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        return service.findByPaciente(p);
    }

    @PostMapping("/evaluaciones")
    public ResponseEntity<EvaluacionPsicologica> crear(@RequestBody Map<String, Object> body) {
        Long pacienteId = body.get("pacienteId") instanceof Number ? ((Number) body.get("pacienteId")).longValue() : null;
        String tipo = String.valueOf(body.getOrDefault("tipo", ""));
        Integer puntaje = body.get("puntaje") instanceof Number ? ((Number) body.get("puntaje")).intValue() : null;
        String respuestasJson = String.valueOf(body.getOrDefault("respuestasJson", "{}"));
        String notas = String.valueOf(body.getOrDefault("notas", ""));

        if (pacienteId == null || tipo.isBlank() || puntaje == null) {
            return ResponseEntity.badRequest().build();
        }
        Persona p = personaRepo.findById(pacienteId).orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        EvaluacionPsicologica e = new EvaluacionPsicologica();
        e.setPaciente(p);
        e.setTipo(tipo);
        e.setPuntaje(puntaje);
        e.setRespuestasJson(respuestasJson);
        e.setNotas(notas);
        e.setFecha(LocalDate.now());
        EvaluacionPsicologica saved = service.save(e);
        EvaluacionEvent evt = new EvaluacionEvent(
                p.getIdPersona(),
                p.getNombreCompleto(),
                p.getEmail(),
                p.getTelefono(),
                tipo,
                puntaje,
                notas
        );
        events.publish("eval.submitted", evt);
        return ResponseEntity.ok(saved);
    }
}
