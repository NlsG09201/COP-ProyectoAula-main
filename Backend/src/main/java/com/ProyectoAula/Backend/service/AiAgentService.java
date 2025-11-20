package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.Cita;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiAgentService {

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
    public String responder(String message) {
        if (message == null || message.isBlank()) return "¿Puedes detallar tu consulta?";
        String m = message.toLowerCase(Locale.ROOT);
        if (m.contains("horario") || m.contains("hora")) {
            return "Atendemos de lunes a viernes, 08:00 a 18:00.";
        }
        if (m.contains("direccion") || m.contains("ubicacion") || m.contains("donde")) {
            return "Estamos en Av. Principal 123, Centro, PB.";
        }
        if (m.contains("precio") || m.contains("costo")) {
            return "Los precios dependen del servicio; te cotizamos tras evaluación inicial.";
        }
        if (m.contains("odontologia") || m.contains("caries") || m.contains("limpieza")) {
            return "Ofrecemos odontología general, limpieza, restauraciones y ortodoncia.";
        }
        if (m.contains("psicologia") || m.contains("ansiedad") || m.contains("estres")) {
            return "Contamos con psicología clínica para ansiedad, estrés y terapia individual.";
        }
        if (m.contains("cita") || m.contains("agendar")) {
            return "Puedes agendar por el botón 'Solicitar Cita' o escribir tu disponibilidad y datos.";
        }
        return "Puedo ayudarte con horarios, ubicación, servicios y agendamiento. ¿Qué necesitas?";
    }
}