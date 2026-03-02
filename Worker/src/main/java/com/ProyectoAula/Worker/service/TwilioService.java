package com.ProyectoAula.Worker.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class TwilioService {

    private static final Logger log = LoggerFactory.getLogger(TwilioService.class);

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @Value("${twilio.whatsapp-from:}")
    private String whatsappFrom;

    @PostConstruct
    public void init() {
        if (isConfigured()) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio inicializado correctamente para WhatsApp.");
        } else {
            log.warn("Twilio no está configurado (sid o token vacíos). Las notificaciones de WhatsApp se simularán.");
        }
    }

    public boolean isConfigured() {
        return accountSid != null && !accountSid.isBlank() && 
               authToken != null && !authToken.isBlank();
    }

    public void enviarWhatsApp(String toMobile, String mensaje) {
        if (!isConfigured()) {
            log.info("[SIMULADO WHATSAPP] To: {}, Msg: {}", toMobile, mensaje);
            return;
        }

        try {
            // Twilio requiere que el número destino tenga el prefijo 'whatsapp:'
            String to = toMobile.startsWith("whatsapp:") ? toMobile : "whatsapp:" + toMobile;
            String from = whatsappFrom.startsWith("whatsapp:") ? whatsappFrom : "whatsapp:" + whatsappFrom;

            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(from),
                    mensaje
            ).create();

            log.info("WhatsApp enviado vía Twilio. SID: {}", message.getSid());
        } catch (Exception e) {
            log.error("Error enviando WhatsApp vía Twilio a {}: {}", toMobile, e.getMessage());
        }
    }
}
