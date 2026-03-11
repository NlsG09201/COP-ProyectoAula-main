package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.Cita;
import com.ProyectoAula.Backend.model.ConsultaIA;
import com.ProyectoAula.Backend.repository.ConsultaIARepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiAgentService {

    private final ConsultaIARepository consultaIARepository;

    public AiAgentService(ConsultaIARepository consultaIARepository) {
        this.consultaIARepository = consultaIARepository;
    }

    // Organiza citas: evita solapes, sugiere reubicación en franjas de 30 min
    public List<Cita> organizarCitas(List<Cita> citas) {
        if (citas == null) return Collections.emptyList();
        // Agrupar por día y ordenar por hora
        Map<LocalDate, List<Cita>> porDia = citas.stream()
                .filter(c -> c.getFecha() != null && c.getHora() != null)
                .collect(Collectors.groupingBy(Cita::getFecha));

        List<Cita> resultado = new ArrayList<>();
        for (var entry : porDia.entrySet()) {
            List<Cita> delDia = entry.getValue().stream()
                    .sorted(Comparator.comparing(Cita::getHora))
                    .collect(Collectors.toList());
            LocalTime cursor = LocalTime.of(8, 0); // Inicio jornada 08:00
            for (Cita c : delDia) {
                // Si la cita está antes del cursor, reubicar a cursor
                if (c.getHora().isBefore(cursor)) {
                    c.setHora(cursor);
                }
                // Asumir duración 30 min y avanzar cursor
                cursor = c.getHora().plusMinutes(30);
                // Evitar pasar de 18:00, mover al día siguiente 08:00
                if (cursor.isAfter(LocalTime.of(18, 0))) {
                    c.setFecha(c.getFecha().plusDays(1));
                    c.setHora(LocalTime.of(8, 0));
                    cursor = LocalTime.of(8, 30);
                }
                resultado.add(c);
            }
        }
        // Asegurar orden consistente por fecha/hora
        return resultado.stream()
                .sorted(Comparator.comparing(Cita::getFecha).thenComparing(Cita::getHora))
                .collect(Collectors.toList());
    }

    // Respuestas básicas de atención al cliente (FAQ)
    public ConsultaIA responder(String message, String clienteUsername, String agente) {
        if (message == null || message.isBlank()) {
            String reply = "¿Puedes detallar tu consulta?";
            ConsultaIA consulta = new ConsultaIA();
            consulta.setAgente(agente != null ? agente : "FAQ");
            consulta.setPregunta("");
            consulta.setRespuesta(reply);
            consulta.setClienteUsername(clienteUsername);
            consulta.setFechaHora(java.time.LocalDateTime.now());
            consulta.setTokensAproximados(Integer.valueOf(reply.length() / 4));
            consulta.setEstado("COMPLETADA");
            return consultaIARepository.save(consulta);
        }
        String m = message.toLowerCase(Locale.ROOT);
        String reply;
        if (m.contains("horario") || m.contains("hora")) {
            reply = "Atendemos de lunes a viernes, 08:00 a 18:00.";
        } else if (m.contains("direccion") || m.contains("ubicacion") || m.contains("donde")) {
            reply = "Estamos en Av. Principal 123, Centro, PB.";
        } else if (m.contains("precio") || m.contains("costo")) {
            reply = "Los precios dependen del servicio; te cotizamos tras evaluación inicial.";
        } else if (m.contains("odontologia") || m.contains("caries") || m.contains("limpieza")) {
            reply = "Ofrecemos odontología general, limpieza, restauraciones y ortodoncia.";
        } else if (m.contains("psicologia") || m.contains("ansiedad") || m.contains("estres")) {
            reply = "Contamos con psicología clínica para ansiedad, estrés y terapia individual.";
        } else if (m.contains("cita") || m.contains("agendar")) {
            reply = "Puedes agendar por el botón 'Solicitar Cita' o escribir tu disponibilidad y datos.";
        } else {
            reply = "Puedo ayudarte con horarios, ubicación, servicios y agendamiento. ¿Qué necesitas?";
        }
        ConsultaIA consulta = new ConsultaIA();
        consulta.setAgente(agente != null ? agente : "FAQ");
        consulta.setPregunta(message);
        consulta.setRespuesta(reply);
        consulta.setClienteUsername(clienteUsername);
        consulta.setFechaHora(java.time.LocalDateTime.now());
        consulta.setTokensAproximados(Integer.valueOf((message.length() + reply.length()) / 4));
        consulta.setEstado("COMPLETADA");
        return consultaIARepository.save(consulta);
    }
}
