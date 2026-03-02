package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.event.CitaEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

@Service
public class EventPublisher {
    private final RabbitTemplate rabbitTemplate;
    private final JmsTemplate jmsTemplate;

    public EventPublisher(RabbitTemplate rabbitTemplate,
                          MessageConverter rabbitConverter,
                          JmsTemplate jmsTemplate) {
        this.rabbitTemplate = rabbitTemplate;
        this.jmsTemplate = jmsTemplate;
        this.rabbitTemplate.setMessageConverter(rabbitConverter);
    }

    public void publish(String routingKey, CitaEvent event) {
        System.out.println("DEBUG: Publicando evento a RabbitMQ -> routingKey: " + routingKey + ", citaId: " + event.getIdCita());
        try {
            rabbitTemplate.convertAndSend("cop.events", routingKey, event);
            System.out.println("✅ Evento publicado correctamente en cop.events");
        } catch (Exception e) {
            System.err.println("❌ Error al publicar en RabbitMQ: " + e.getMessage());
            e.printStackTrace();
        }
        try {
            jmsTemplate.convertAndSend("cop.events", event, m -> { m.setStringProperty("routingKey", routingKey); return m; });
        } catch (Exception ignored) {}
    }
}
