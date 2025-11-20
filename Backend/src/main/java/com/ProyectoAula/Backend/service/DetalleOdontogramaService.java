package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.DetalleOdontograma;
import com.ProyectoAula.Backend.repository.DetalleOdontogramaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleOdontogramaService {

    private final DetalleOdontogramaRepository detalleRepository;

    public DetalleOdontogramaService(DetalleOdontogramaRepository detalleRepository) {
        this.detalleRepository = detalleRepository;
    }

    public List<DetalleOdontograma> findAll() { return detalleRepository.findAll(); }

    public Optional<DetalleOdontograma> findById(Long id) { return detalleRepository.findById(id); }

    @Transactional
    public DetalleOdontograma save(DetalleOdontograma detalle) { return detalleRepository.save(detalle); }

    @Transactional
    public void deleteById(Long id) { detalleRepository.deleteById(id); }
}