package com.ProyectoAula.Backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.support.converter.MappingJackson2MessageConverter;

@Configuration
public class ActiveMqConfig {

    @Bean
    public MappingJackson2MessageConverter jmsJacksonConverter() {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setTypeIdPropertyName("_type");
        return converter;
    }

    @Bean
    public JmsTemplate jmsTemplate(org.springframework.jms.core.JmsTemplate template,
                                   MappingJackson2MessageConverter converter) {
        template.setPubSubDomain(true);
        template.setMessageConverter(converter);
        return template;
    }
}
