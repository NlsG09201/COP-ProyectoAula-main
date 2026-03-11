package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.EvaluacionPsicologica;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.repository.EvaluacionPsicologicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EvaluacionPsicologicaService {
    private final EvaluacionPsicologicaRepository repo;

    public EvaluacionPsicologicaService(EvaluacionPsicologicaRepository repo) { this.repo = repo; }

    public List<EvaluacionPsicologica> findAll() { return repo.findAll(); }
    public Optional<EvaluacionPsicologica> findById(Long id) { return repo.findById(id); }
    public List<EvaluacionPsicologica> findByPaciente(Persona p) { return repo.findByPaciente(p); }
    public List<EvaluacionPsicologica> findByTipo(String tipo) { return repo.findByTipo(tipo); }
    public List<EvaluacionPsicologica> findByFechaBetween(LocalDate desde, LocalDate hasta) { return repo.findByFechaBetween(desde, hasta); }

    @Transactional
    public EvaluacionPsicologica save(EvaluacionPsicologica e) { return repo.save(e); }

    @Transactional
    public void deleteById(Long id) { repo.deleteById(id); }
}
