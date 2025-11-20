package com.ProyectoAula.Worker.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitConfig {
    @Bean
    public TopicExchange eventsExchange() { return new TopicExchange("cop.events"); }
    @Bean
    public Queue citaEventsQueue() { return new Queue("cop.cita.events", true); }
    @Bean
    public Binding citaCreatedBinding(Queue citaEventsQueue, TopicExchange eventsExchange) {
        return BindingBuilder.bind(citaEventsQueue).to(eventsExchange).with("cita.created");
    }
    @Bean
    public Binding citaUpdatedBinding(Queue citaEventsQueue, TopicExchange eventsExchange) {
        return BindingBuilder.bind(citaEventsQueue).to(eventsExchange).with("cita.updated");
    }

    @Bean
    public Binding citaConfirmedBinding(Queue citaEventsQueue, TopicExchange eventsExchange) {
        return BindingBuilder.bind(citaEventsQueue).to(eventsExchange).with("cita.confirmed");
    }
    @Bean
    public Jackson2JsonMessageConverter jacksonConverter() { return new Jackson2JsonMessageConverter(); }
}
