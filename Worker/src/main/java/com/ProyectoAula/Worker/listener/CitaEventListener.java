package com.ProyectoAula.Worker.listener;

import com.ProyectoAula.Worker.event.CitaEvent;
import com.ProyectoAula.Worker.mongo.ReminderLog;
import com.ProyectoAula.Worker.mongo.ReminderLogRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class CitaEventListener {
    private final ReminderLogRepository repo;
    @Autowired(required = false)
    private JavaMailSender mailSender;
    @Value("${spring.mail.from:}")
    private String fromAddress;

    public CitaEventListener(ReminderLogRepository repo) { this.repo = repo; }

    @RabbitListener(queues = "cop.cita.events")
    public void onMessage(CitaEvent evt) {
        LocalDateTime citaFechaHora = evt.getFecha() != null && evt.getHora() != null
                ? LocalDateTime.of(evt.getFecha(), evt.getHora())
                : null;
        ReminderLog log = new ReminderLog(
                evt.getIdCita(),
                evt.getPacienteNombre(),
                evt.getPacienteEmail(),
                citaFechaHora,
                evt.getServicioNombre() != null ? List.of(evt.getServicioNombre()) : List.of(),
                "EVENT_" + evt.getTipo(),
                null,
                LocalDateTime.now()
        );
        repo.save(log);

        if ("CONFIRMED".equalsIgnoreCase(evt.getTipo())) {
            String email = evt.getPacienteEmail();
            String pacienteNombre = evt.getPacienteNombre();
            if (email != null && !email.isBlank() && mailSender != null && fromAddress != null && !fromAddress.isBlank()) {
                try {
                    SimpleMailMessage msg = new SimpleMailMessage();
                    msg.setFrom(fromAddress);
                    msg.setTo(email);
                    msg.setSubject("Confirmación de Cita");
                    msg.setText(String.format(
                            "Hola %s,\n\nTu cita ha sido confirmada para el %s a las %s en %s.\n\nMédico: %s\nServicio: %s\n\nSaludos,\nClínica",
                            pacienteNombre,
                            evt.getFecha(),
                            evt.getHora(),
                            evt.getDireccion(),
                            evt.getMedicoNombre(),
                            evt.getServicioNombre()
                    ));
                    mailSender.send(msg);
                } catch (Exception ex) {
                    // Silenciar errores de correo en listener; quedan registrados en logs
                }
            }
        }
    }
}
