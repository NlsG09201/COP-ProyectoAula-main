package com.ProyectoAula.Worker.service;

import com.ProyectoAula.Worker.client.CitaClient;
import com.ProyectoAula.Worker.dto.CitaDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Service
public class ReminderService {

    private static final Logger log = LoggerFactory.getLogger(ReminderService.class);

    private final CitaClient citaClient;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:}")
    private String fromAddress;

    @Value("${worker.reminders.enabled:true}")
    private boolean remindersEnabled;

    public ReminderService(CitaClient citaClient) {
        this.citaClient = citaClient;
    }

    // Ejecuta cada día a las 07:00 AM
    @Scheduled(cron = "${worker.reminders.cron:0 0 7 * * *}")
    public void processDailyReminders() {
        if (!remindersEnabled) {
            log.info("Recordatorios deshabilitados (worker.reminders.enabled=false)");
            return;
        }
        LocalDate targetDate = LocalDate.now().plusDays(1);
        log.info("Buscando citas para recordar en fecha: {}", targetDate);

        List<CitaDto> citas = citaClient.listarCitas();
        DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");

        int total = 0;
        for (CitaDto c : citas) {
            if (c.fecha() != null && c.fecha().equals(targetDate)) {
                total++;
                String email = c.paciente() != null ? c.paciente().email() : null;
                String pacienteNombre = c.paciente() != null ? c.paciente().nombreCompleto() : "Paciente";
                if (email != null && !email.isBlank() && mailSender != null && !Objects.toString(fromAddress, "").isBlank()) {
                    try {
                        SimpleMailMessage msg = new SimpleMailMessage();
                        msg.setFrom(fromAddress);
                        msg.setTo(email);
                        msg.setSubject("Recordatorio de Cita Odontológica");
                        msg.setText(String.format(
                                "Hola %s,\n\nTe recordamos tu cita programada para mañana (%s) a las %s en %s.\n\nSaludos,\nClínica",
                                pacienteNombre,
                                targetDate,
                                c.hora() != null ? timeFmt.format(c.hora()) : "hora no especificada",
                                c.direccion() != null ? c.direccion() : "dirección no especificada"
                        ));
                        mailSender.send(msg);
                        log.info("Recordatorio enviado a {} para cita {}", email, c.idCita());
                    } catch (Exception ex) {
                        log.error("Error enviando correo de recordatorio a {}: {}", email, ex.getMessage());
                    }
                } else {
                    log.info("[Simulado] Recordatorio para {} (email: {}), cita {} a las {} en {}",
                            pacienteNombre,
                            email,
                            c.idCita(),
                            c.hora() != null ? timeFmt.format(c.hora()) : "hora no especificada",
                            c.direccion() != null ? c.direccion() : "dirección no especificada");
                }
            }
        }
        log.info("Procesadas {} citas para recordatorio del día {}", total, targetDate);
    }
}