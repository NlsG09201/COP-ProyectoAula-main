package com.ProyectoAula.Backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Persona.Rol;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.context.annotation.Profile;
import com.ProyectoAula.Backend.mongo.repository.PersonaMongoRepository;
import com.ProyectoAula.Backend.mongo.model.PersonaDoc;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, 
                    "/api/servicios/**", 
                    "/api/dientes/**",
                    "/api/citas/**",
                    "/api/medicos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/pacientes").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/citas").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults()); // Volver a Basic para compatibilidad con el front actual
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:8086","http://localhost:8085"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    @Profile("!mongo")
    public UserDetailsService users(PersonaRepository repo, PasswordEncoder encoder) {
        return username -> {
            Persona p = repo.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
            
            // Permitimos acceso a MÉDICO (Dashboard) y CLIENTE (Portal público)
            if (p.getRol() == Rol.PACIENTE) {
                throw new UsernameNotFoundException("Los pacientes sin cuenta de usuario no pueden loguearse.");
            }
            
            if (p.getPasswordHash() == null || p.getPasswordHash().isBlank()) {
                throw new UsernameNotFoundException("Usuario sin contraseña configurada");
            }
            
            return User.withUsername(p.getUsername())
                    .password(p.getPasswordHash())
                    .roles(p.getRol().name())
                    .build();
        };
    }

    @Bean
    @Profile("mongo")
    public UserDetailsService mongoUsers(PersonaMongoRepository repo, PasswordEncoder encoder) {
        return username -> {
            PersonaDoc p = repo.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
            if (p.getRol() == PersonaDoc.Rol.PACIENTE) {
                throw new UsernameNotFoundException("Los pacientes sin cuenta de usuario no pueden loguearse.");
            }
            if (p.getPasswordHash() == null || p.getPasswordHash().isBlank()) {
                throw new UsernameNotFoundException("Usuario sin contraseña configurada");
            }
            return User.withUsername(p.getUsername())
                    .password(p.getPasswordHash())
                    .roles(p.getRol().name())
                    .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}
