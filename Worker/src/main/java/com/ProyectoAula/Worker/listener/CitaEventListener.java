package com.ProyectoAula.Worker.listener;

import com.ProyectoAula.Worker.event.CitaEvent;
import com.ProyectoAula.Worker.mongo.ReminderLog;
import com.ProyectoAula.Worker.mongo.ReminderLogRepository;
import com.ProyectoAula.Worker.service.TwilioService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class CitaEventListener {
    private final ReminderLogRepository repo;
    private final TwilioService twilioService;
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.from:no-reply@cop.local}")
    private String fromAddress;

    public CitaEventListener(ReminderLogRepository repo, TwilioService twilioService) { 
        this.repo = repo; 
        this.twilioService = twilioService;
    }

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
            String telefono = evt.getPacienteTelefono();
            String pacienteNombre = evt.getPacienteNombre() != null ? evt.getPacienteNombre() : "Paciente";

            // 1. Notificación por Correo (HTML)
            if (email != null && !email.isBlank() && mailSender != null) {
                try {
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                    
                    helper.setFrom(fromAddress);
                    helper.setTo(email);
                    helper.setSubject("🦷 Confirmación de Cita - Clínica COP");

                    String htmlMsg = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>" +
                            "<div style='background-color: #2563eb; color: white; padding: 20px; text-align: center;'>" +
                            "<h1>Clínica COP</h1>" +
                            "</div>" +
                            "<div style='padding: 20px; color: #1e293b; line-height: 1.6;'>" +
                            "<h2>¡Hola, " + pacienteNombre + "!</h2>" +
                            "<p>Te confirmamos que tu cita ha sido agendada con éxito. Aquí tienes los detalles:</p>" +
                            "<div style='background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;'>" +
                            "<strong>📅 Fecha:</strong> " + evt.getFecha() + "<br>" +
                            "<strong>⏰ Hora:</strong> " + evt.getHora() + "<br>" +
                            "<strong>📍 Ubicación:</strong> " + (evt.getDireccion() != null ? evt.getDireccion() : "Sede Principal") + "<br>" +
                            "<strong>👨‍⚕️ Médico:</strong> " + (evt.getMedicoNombre() != null ? evt.getMedicoNombre() : "Asignado") + "<br>" +
                            "<strong>🦷 Servicio:</strong> " + (evt.getServicioNombre() != null ? evt.getServicioNombre() : "Consulta General") +
                            "</div>" +
                            "<p>Por favor, llega 10 minutos antes de tu cita. Si necesitas reprogramar, contáctanos lo antes posible.</p>" +
                            "</div>" +
                            "<div style='background-color: #f1f5f9; color: #64748b; padding: 15px; text-align: center; font-size: 12px;'>" +
                            "© 2026 Clínica COP. Este es un mensaje automático, por favor no respondas." +
                            "</div>" +
                            "</div>";

                    helper.setText(htmlMsg, true);
                    mailSender.send(message);
                } catch (Exception ex) {
                    // Log del error de correo
                }
            }

            // 2. Notificación por WhatsApp
            if (telefono != null && !telefono.isBlank()) {
                String mensaje = String.format(
                        "🦷 *Confirmación de Cita - Clínica COP*\n\n" +
                        "¡Hola, *%s*! 👋\n\n" +
                        "Tu cita ha sido confirmada con éxito:\n" +
                        "📅 *Fecha:* %s\n" +
                        "⏰ *Hora:* %s\n" +
                        "📍 *Ubicación:* %s\n" +
                        "👨‍⚕️ *Médico:* %s\n" +
                        "🦷 *Servicio:* %s\n\n" +
                        "¡Te esperamos! Por favor llega 10 minutos antes. 😊",
                        pacienteNombre,
                        evt.getFecha(),
                        evt.getHora(),
                        (evt.getDireccion() != null ? evt.getDireccion() : "Sede Principal"),
                        (evt.getMedicoNombre() != null ? evt.getMedicoNombre() : "Asignado"),
                        (evt.getServicioNombre() != null ? evt.getServicioNombre() : "Consulta General")
                );
                twilioService.enviarWhatsApp(telefono, mensaje);
            }
        }
    }
}
