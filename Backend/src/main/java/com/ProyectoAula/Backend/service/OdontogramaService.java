package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.Odontograma;
import com.ProyectoAula.Backend.repository.OdontogramaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OdontogramaService {

    private final OdontogramaRepository odontogramaRepository;

    public OdontogramaService(OdontogramaRepository odontogramaRepository) {
        this.odontogramaRepository = odontogramaRepository;
    }

    public List<Odontograma> findAll() { return odontogramaRepository.findAll(); }

    public Optional<Odontograma> findById(Long id) { return odontogramaRepository.findById(id); }

    @Transactional
    public Odontograma save(Odontograma odontograma) { return odontogramaRepository.save(odontograma); }

    @Transactional
    public void deleteById(Long id) { odontogramaRepository.deleteById(id); }
}