package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.event.CitaEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.stereotype.Service;

@Service
public class EventPublisher {
    private final RabbitTemplate rabbitTemplate;
    private final MessageConverter converter;

    public EventPublisher(RabbitTemplate rabbitTemplate, MessageConverter converter) {
        this.rabbitTemplate = rabbitTemplate;
        this.converter = converter;
        this.rabbitTemplate.setMessageConverter(converter);
    }

    public void publish(String routingKey, CitaEvent event) {
        try {
            rabbitTemplate.convertAndSend("cop.events", routingKey, event);
        } catch (Exception ignored) {
            // Si RabbitMQ no está disponible, no bloquear el flujo HTTP
        }
    }
}
