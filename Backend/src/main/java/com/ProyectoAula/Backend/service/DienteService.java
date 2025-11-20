package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.Diente;
import com.ProyectoAula.Backend.repository.DienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DienteService {

    private final DienteRepository dienteRepository;

    public DienteService(DienteRepository dienteRepository) {
        this.dienteRepository = dienteRepository;
    }

    public List<Diente> findAll() { return dienteRepository.findAll(); }

    public Optional<Diente> findById(Long id) { return dienteRepository.findById(id); }

    @Transactional
    public Diente save(Diente diente) { return dienteRepository.save(diente); }

    @Transactional
    public void deleteById(Long id) { dienteRepository.deleteById(id); }

    public Optional<Diente> findByCodigoFDI(String codigoFDI) { return dienteRepository.findByCodigoFDI(codigoFDI); }

    public List<Diente> searchByNombre(String texto) { return dienteRepository.findByNombreContainingIgnoreCase(texto); }
}