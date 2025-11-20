package com.ProyectoAula.Backend.service;

import com.ProyectoAula.Backend.model.Servicio;
import com.ProyectoAula.Backend.model.TipoServicio;
import com.ProyectoAula.Backend.repository.ServicioRepository;
import com.ProyectoAula.Backend.repository.TipoServicioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final TipoServicioRepository tipoServicioRepository;

    public ServicioService(ServicioRepository servicioRepository, TipoServicioRepository tipoServicioRepository) {
        this.servicioRepository = servicioRepository;
        this.tipoServicioRepository = tipoServicioRepository;
    }

    public List<Servicio> findAll() { return servicioRepository.findAll(); }

    public Optional<Servicio> findById(Long id) { return servicioRepository.findById(id); }

    @Transactional
    public Servicio save(Servicio servicio) { return servicioRepository.save(servicio); }

    @Transactional
    public void deleteById(Long id) { servicioRepository.deleteById(id); }

    public Optional<TipoServicio> findTipoByNombre(String nombre) { return tipoServicioRepository.findByNombre(nombre); }

    public List<Servicio> searchByTipoNombre(String texto) { return servicioRepository.findByTipoServicio_NombreContainingIgnoreCase(texto); }
}