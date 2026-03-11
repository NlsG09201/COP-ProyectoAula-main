package com.ProyectoAula.Worker.listener;

import com.ProyectoAula.Worker.event.EvaluacionEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@Component
public class EvaluacionEventListener {
    @Autowired(required = false)
    private JavaMailSender mailSender;
    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.mail.from:no-reply@cop.local}")
    private String fromAddress;
    @Value("${worker.backend.base-url:http://localhost:8080/api}")
    private String baseUrl;

    @RabbitListener(queues = "cop.eval.events")
    public void onEval(EvaluacionEvent evt) {
        String email = evt.getPacienteEmail();
        String nombre = evt.getPacienteNombre() != null ? evt.getPacienteNombre() : "Paciente";
        if (email != null && !email.isBlank() && mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromAddress);
                helper.setTo(email);
                helper.setSubject("Resultados de Autoevaluación - Clínica COP");
                String html = "<div style='font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e2e8f0; border-radius:8px'>" +
                        "<div style='background:#2563eb; color:#fff; padding:16px; text-align:center'><h2>Clínica COP</h2></div>" +
                        "<div style='padding:16px; color:#1e293b'>" +
                        "<p>Hola, " + nombre + ".</p>" +
                        "<p>Recibimos tu autoevaluación (" + evt.getTipoEvaluacion() + "). Puntaje: <strong>" + evt.getPuntaje() + "</strong>.</p>" +
                        "<p>Nuestro equipo te puede atender. Puedes agendar una terapia desde el portal o responder este correo.</p>" +
                        "</div></div>";
                helper.setText(html, true);
                mailSender.send(message);
            } catch (Exception ignored) {}
        }
        if (evt.getPuntaje() != null && evt.getPuntaje() >= 10 && evt.getPacienteId() != null) {
            try {
                Long servicioId = resolverServicioPsico("Terapia Individual");
                if (servicioId != null) {
                    Map<String, Object> body = Map.of(
                            "fecha", LocalDate.now().plusDays(1).toString(),
                            "hora", LocalTime.of(9, 30).toString(),
                            "direccion", "Clínica COP",
                            "paciente", Map.of("idPersona", evt.getPacienteId()),
                            "servicio", Map.of("idServicio", servicioId)
                    );
                    var res = restTemplate.postForEntity(baseUrl + "/citas", body, java.util.Map.class);
                    if (res.getStatusCode().is2xxSuccessful() && res.getBody() instanceof java.util.Map<?, ?> map) {
                        Object id = map.get("idCita");
                        if (id instanceof Number n) {
                            Long citaId = n.longValue();
                            restTemplate.postForEntity(baseUrl + "/citas/" + citaId + "/auto-asignar?confirmar=true", null, java.util.Map.class);
                        }
                    }
                }
            } catch (Exception ignored) {}
        }
    }

    private Long resolverServicioPsico(String nombrePreferido) {
        try {
            var servicios = restTemplate.getForObject(baseUrl + "/servicios", java.util.List.class);
            if (servicios instanceof java.util.List<?> list) {
                for (Object o : list) {
                    if (o instanceof java.util.Map<?, ?> m) {
                        Object nombre = m.get("nombre");
                        Object id = m.get("idServicio");
                        if (nombrePreferido.equals(nombre) && id instanceof Number n) {
                            return n.longValue();
                        }
                    }
                }
            }
        } catch (Exception ignored) {}
        return null;
    }
}
