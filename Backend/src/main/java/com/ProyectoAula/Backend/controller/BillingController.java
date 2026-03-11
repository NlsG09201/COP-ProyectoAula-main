package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.ConsultaIA;
import com.ProyectoAula.Backend.model.RegistroCobro;
import com.ProyectoAula.Backend.repository.ConsultaIARepository;
import com.ProyectoAula.Backend.repository.RegistroCobroRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*")
public class BillingController {

    private final ConsultaIARepository consultaIARepository;
    private final RegistroCobroRepository registroCobroRepository;

    public BillingController(ConsultaIARepository consultaIARepository,
                             RegistroCobroRepository registroCobroRepository) {
        this.consultaIARepository = consultaIARepository;
        this.registroCobroRepository = registroCobroRepository;
    }

    @GetMapping("/historial")
    public Map<String, Object> historial(@RequestParam String clienteUsername) {
        List<ConsultaIA> consultas = consultaIARepository.findByClienteUsernameOrderByFechaHoraDesc(clienteUsername);
        List<RegistroCobro> cobros = registroCobroRepository.findByClienteUsernameOrderByFechaHoraDesc(clienteUsername);
        return Map.of(
                "consultas", consultas,
                "cobros", cobros
        );
    }
}

