package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Contacto;
import com.ProyectoAula.Backend.repository.ContactoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "*")
public class ContactoController {

    private final ContactoRepository repo;

    public ContactoController(ContactoRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public ResponseEntity<?> enviar(@RequestBody Contacto contacto) {
        contacto.setFechaEnvio(LocalDateTime.now());
        repo.save(contacto);
        return ResponseEntity.ok(Map.of("message", "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto."));
    }
}
