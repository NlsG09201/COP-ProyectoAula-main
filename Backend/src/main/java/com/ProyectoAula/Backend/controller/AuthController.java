package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Persona.Rol;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final PersonaRepository personaRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(PersonaRepository personaRepository, PasswordEncoder passwordEncoder) {
        this.personaRepository = personaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Persona cliente) {
        if (cliente.getUsername() == null || cliente.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario es obligatorio");
        }
        if (cliente.getPasswordHash() == null || cliente.getPasswordHash().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contraseña es obligatoria");
        }
        
        if (personaRepository.findByUsername(cliente.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El nombre de usuario ya existe");
        }

        cliente.setRol(Rol.CLIENTE);
        cliente.setPasswordHash(passwordEncoder.encode(cliente.getPasswordHash()));
        
        Persona guardado = personaRepository.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<Persona> personaOpt = personaRepository.findByUsername(username);
        
        if (personaOpt.isPresent()) {
            Persona p = personaOpt.get();
            if (passwordEncoder.matches(password, p.getPasswordHash())) {
                // Para este proyecto simple, devolvemos el objeto persona (en un sistema real usaríamos JWT)
                return ResponseEntity.ok(p);
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Credenciales inválidas"));
    }
}
