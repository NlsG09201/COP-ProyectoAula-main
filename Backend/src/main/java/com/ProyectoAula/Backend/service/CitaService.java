package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.Cita;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.repository.CitaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    private final CitaRepository citaRepository;

    public CitaService(CitaRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    public List<Cita> findAll() { return citaRepository.findAll(); }

    public Optional<Cita> findById(Long id) { return citaRepository.findById(id); }

    @Transactional
    public Cita save(Cita cita) { return citaRepository.save(cita); }

    @Transactional
    public void deleteById(Long id) { citaRepository.deleteById(id); }

    public List<Cita> findByPaciente(Persona paciente) { return citaRepository.findByPaciente(paciente); }

    public List<Cita> findByMedico(Persona medico) { return citaRepository.findByMedico(medico); }

    public List<Cita> findByFecha(LocalDate fecha) { return citaRepository.findByFecha(fecha); }

    public List<Cita> findByFechaBetween(LocalDate inicio, LocalDate fin) { return citaRepository.findByFechaBetween(inicio, fin); }
}