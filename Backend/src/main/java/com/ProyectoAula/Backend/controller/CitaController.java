package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Cita;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Servicio;
import com.ProyectoAula.Backend.repository.CitaRepository;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import com.ProyectoAula.Backend.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;
import com.ProyectoAula.Backend.service.EventPublisher;
import com.ProyectoAula.Backend.event.CitaEvent;

import java.util.List;
import java.time.DayOfWeek;
import java.util.Optional;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    private final CitaRepository citaRepo;
    private final PersonaRepository personaRepo;
    private final ServicioRepository servicioRepo;
    private final EventPublisher events;

    public CitaController(CitaRepository citaRepo,
                          PersonaRepository personaRepo,
                          ServicioRepository servicioRepo,
                          EventPublisher events) {
        this.citaRepo = citaRepo;
        this.personaRepo = personaRepo;
        this.servicioRepo = servicioRepo;
        this.events = events;
    }

    // 🔹 Listar todas las citas
    @GetMapping
    public List<Cita> listar() {
        return citaRepo.findAll();
    }

    // 🔹 Obtener cita por ID
    @GetMapping("/{id}")
    public Cita obtener(@PathVariable Long id) {
        return citaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
    }

    @PostMapping
    public Cita crear(@RequestBody Cita cita) {
        if (cita.getDireccion() == null || cita.getDireccion().isBlank()) {
            cita.setDireccion("Clínica COP");
        }
        if (cita.getPaciente() != null && cita.getPaciente().getIdPersona() != null) {
            Persona paciente = personaRepo.findById(cita.getPaciente().getIdPersona())
                    .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
            cita.setPaciente(paciente);
        }

        if (cita.getMedico() != null && cita.getMedico().getIdPersona() != null) {
            Persona medico = personaRepo.findById(cita.getMedico().getIdPersona())
                    .orElseThrow(() -> new RuntimeException("Médico no encontrado"));
            cita.setMedico(medico);
        }

        if (cita.getServicio() != null && cita.getServicio().getIdServicio() != null) {
            Servicio servicio = servicioRepo.findById(cita.getServicio().getIdServicio())
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
            cita.setServicio(servicio);
        }

        if (cita.getMedico() != null) {
            Persona m = cita.getMedico();
            DayOfWeek dia = cita.getFecha().getDayOfWeek();
            String dias = Optional.ofNullable(m.getDiasDisponibles()).orElse("");
            boolean diaDisponible = dias.isEmpty() || dias.contains(dia.name());
            if (!diaDisponible) {
                throw new RuntimeException("El médico no está disponible en el día seleccionado");
            }
            if (m.getHoraInicioDisponibilidad() != null && cita.getHora().isBefore(m.getHoraInicioDisponibilidad())) {
                throw new RuntimeException("Hora fuera del rango de disponibilidad del médico");
            }
            if (m.getHoraFinDisponibilidad() != null && cita.getHora().isAfter(m.getHoraFinDisponibilidad())) {
                throw new RuntimeException("Hora fuera del rango de disponibilidad del médico");
            }

            List<Cita> existentes = citaRepo.findByMedico(m).stream()
                    .filter(c -> c.getFecha().equals(cita.getFecha()) && c.getHora().equals(cita.getHora()))
                    .toList();
            if (!existentes.isEmpty()) {
                throw new RuntimeException("Ya existe una cita para el médico en esa fecha y hora");
            }
        }

        Cita creada = citaRepo.save(cita);
        CitaEvent evt = new CitaEvent(
                creada.getIdCita(),
                creada.getFecha(),
                creada.getHora(),
                creada.getDireccion(),
                creada.getPaciente() != null ? creada.getPaciente().getNombreCompleto() : null,
                creada.getPaciente() != null ? creada.getPaciente().getEmail() : null,
                creada.getMedico() != null ? creada.getMedico().getNombreCompleto() : null,
                creada.getServicio() != null ? creada.getServicio().getTipoServicio().getNombre() : null,
                "CREATED"
        );
        events.publish("cita.created", evt);
        return creada;
    }

    // 🔹 Actualizar cita
    @PutMapping("/{id}")
    public Cita actualizar(@PathVariable Long id, @RequestBody Cita datos) {
        Cita c = citaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        c.setFecha(datos.getFecha());
        c.setHora(datos.getHora());
        c.setDireccion(datos.getDireccion());
        Cita actualizada = citaRepo.save(c);
        CitaEvent evt = new CitaEvent(
                actualizada.getIdCita(),
                actualizada.getFecha(),
                actualizada.getHora(),
                actualizada.getDireccion(),
                actualizada.getPaciente() != null ? actualizada.getPaciente().getNombreCompleto() : null,
                actualizada.getPaciente() != null ? actualizada.getPaciente().getEmail() : null,
                actualizada.getMedico() != null ? actualizada.getMedico().getNombreCompleto() : null,
                actualizada.getServicio() != null ? actualizada.getServicio().getTipoServicio().getNombre() : null,
                "UPDATED"
        );
        events.publish("cita.updated", evt);
        return actualizada;
    }

    // 🔹 Eliminar cita
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        citaRepo.deleteById(id);
    }

    // 🔹 Confirmar cita y enviar notificación
    @PostMapping("/{id}/confirmar")
    public Cita confirmar(@PathVariable Long id) {
        Cita c = citaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        CitaEvent evt = new CitaEvent(
                c.getIdCita(),
                c.getFecha(),
                c.getHora(),
                c.getDireccion(),
                c.getPaciente() != null ? c.getPaciente().getNombreCompleto() : null,
                c.getPaciente() != null ? c.getPaciente().getEmail() : null,
                c.getMedico() != null ? c.getMedico().getNombreCompleto() : null,
                c.getServicio() != null ? c.getServicio().getTipoServicio().getNombre() : null,
                "CONFIRMED"
        );
        events.publish("cita.confirmed", evt);
        return c;
    }
    // 🔹 Asignar médico y confirmar cita
    @PostMapping("/{id}/asignar")
    public Cita asignar(@PathVariable Long id, @RequestParam Long medicoId, @RequestParam(defaultValue = "false") boolean confirmar) {
        Cita c = citaRepo.findById(id).orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        Persona m = personaRepo.findById(medicoId).orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        DayOfWeek dia = c.getFecha().getDayOfWeek();
        String dias = Optional.ofNullable(m.getDiasDisponibles()).orElse("");
        boolean diaDisponible = dias.isEmpty() || dias.contains(dia.name());
        if (!diaDisponible) throw new RuntimeException("El médico no está disponible en el día seleccionado");
        if (m.getHoraInicioDisponibilidad() != null && c.getHora().isBefore(m.getHoraInicioDisponibilidad())) throw new RuntimeException("Hora fuera del rango de disponibilidad del médico");
        if (m.getHoraFinDisponibilidad() != null && c.getHora().isAfter(m.getHoraFinDisponibilidad())) throw new RuntimeException("Hora fuera del rango de disponibilidad del médico");

        List<Cita> existentes = citaRepo.findByMedico(m).stream()
                .filter(ci -> !ci.getIdCita().equals(c.getIdCita()) && ci.getFecha().equals(c.getFecha()) && ci.getHora().equals(c.getHora()))
                .toList();
        if (!existentes.isEmpty()) throw new RuntimeException("Ya existe una cita para el médico en esa fecha y hora");

        c.setMedico(m);
        Cita actualizada = citaRepo.save(c);

        if (confirmar) {
            CitaEvent evt = new CitaEvent(
                    actualizada.getIdCita(),
                    actualizada.getFecha(),
                    actualizada.getHora(),
                    actualizada.getDireccion(),
                    actualizada.getPaciente() != null ? actualizada.getPaciente().getNombreCompleto() : null,
                    actualizada.getPaciente() != null ? actualizada.getPaciente().getEmail() : null,
                    actualizada.getMedico() != null ? actualizada.getMedico().getNombreCompleto() : null,
                    actualizada.getServicio() != null ? actualizada.getServicio().getTipoServicio().getNombre() : null,
                    "CONFIRMED"
            );
            events.publish("cita.confirmed", evt);
        }
        return actualizada;
    }
}
