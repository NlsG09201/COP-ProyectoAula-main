package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.ConsultaIA;
import com.ProyectoAula.Backend.model.RegistroCobro;
import com.ProyectoAula.Backend.repository.RegistroCobroRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class BillingService {

    private final RegistroCobroRepository registroCobroRepository;

    public BillingService(RegistroCobroRepository registroCobroRepository) {
        this.registroCobroRepository = registroCobroRepository;
    }

    public RegistroCobro registrarCobroConsulta(ConsultaIA consulta) {
        RegistroCobro r = new RegistroCobro();
        r.setClienteUsername(consulta.getClienteUsername());
        r.setTipoServicio(consulta.getAgente());
        r.setFechaHora(LocalDateTime.now());
        // Regla simple: base 1.00 + 0.01 por cada 50 caracteres de pregunta+respuesta
        int length = (consulta.getPregunta() != null ? consulta.getPregunta().length() : 0)
                + (consulta.getRespuesta() != null ? consulta.getRespuesta().length() : 0);
        BigDecimal base = BigDecimal.valueOf(1.00);
        BigDecimal variable = BigDecimal.valueOf(Math.max(0, length / 50) * 0.01);
        r.setMonto(base.add(variable));
        r.setEstadoPago("PENDIENTE");
        return registroCobroRepository.save(r);
    }
}
