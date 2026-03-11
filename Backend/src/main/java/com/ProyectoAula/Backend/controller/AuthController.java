package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Persona.Rol;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
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

    // #region agent log
    private void writeDebugLog(String hypothesisId, String location, String message, String dataJson) {
        String json = "{\"sessionId\":\"e69953\",\"runId\":\"pre-fix\",\"hypothesisId\":\"" + hypothesisId +
                "\",\"location\":\"" + location + "\",\"message\":\"" + message +
                "\",\"data\":" + dataJson + ",\"timestamp\":" + System.currentTimeMillis() + "}";
        try {
            Files.write(
                    Paths.get("c:\\\\Users\\\\nelso\\\\OneDrive\\\\Escritorio\\\\COP-ProyectoAula-main\\\\debug-e69953.log"),
                    (json + System.lineSeparator()).getBytes(),
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND
            );
        } catch (IOException ignored) {
        }
    }
    // #endregion

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Persona cliente) {
        // #region agent log
        writeDebugLog(
                "BH1",
                "AuthController.java:29",
                "Register attempt",
                "{\"username\":\"" + cliente.getUsername() + "\"}"
        );
        // #endregion
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
        // #region agent log
        writeDebugLog(
                "BH2",
                "AuthController.java:44",
                "Register success",
                "{\"id\":" + guardado.getId() + ",\"username\":\"" + guardado.getUsername() + "\"}"
        );
        // #endregion
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // #region agent log
        writeDebugLog(
                "BH3",
                "AuthController.java:49",
                "Login attempt",
                "{\"username\":\"" + username + "\"}"
        );
        // #endregion

        Optional<Persona> personaOpt = personaRepository.findByUsername(username);
        
        if (personaOpt.isPresent()) {
            Persona p = personaOpt.get();
            if (passwordEncoder.matches(password, p.getPasswordHash())) {
                // #region agent log
                writeDebugLog(
                        "BH4",
                        "AuthController.java:57",
                        "Login success",
                        "{\"id\":" + p.getId() + ",\"username\":\"" + p.getUsername() + "\"}"
                );
                // #endregion
                // Para este proyecto simple, devolvemos el objeto persona (en un sistema real usaríamos JWT)
                return ResponseEntity.ok(p);
            }
        }
        
        // #region agent log
        writeDebugLog(
                "BH5",
                "AuthController.java:63",
                "Login failed",
                "{\"username\":\"" + username + "\"}"
        );
        // #endregion
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Credenciales inválidas"));
    }
}
