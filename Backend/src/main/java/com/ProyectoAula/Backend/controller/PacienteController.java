package com.ProyectoAula.Backend.controller;

import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Persona.Rol;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import com.ProyectoAula.Backend.repository.CitaRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PersonaRepository repo;
    private final CitaRepository citaRepo;

    public PacienteController(PersonaRepository repo, CitaRepository citaRepo) {
        this.repo = repo;
        this.citaRepo = citaRepo;
    }

    @GetMapping
    public List<Persona> listar() {
        return repo.findByRol(Rol.PACIENTE);
    }

    @GetMapping("/by-doc/{doc}")
    public Persona obtenerPorDocumento(@PathVariable String doc) {
        Persona p = repo.findByDocIden(doc)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente no encontrado"));
        if (p.getRol() != Rol.PACIENTE) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No es un paciente");
        return p;
    }

    @GetMapping("/{id}")
    public Persona obtener(@PathVariable Long id) {
        Persona p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente no encontrado"));
        if (p.getRol() != Rol.PACIENTE) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No es un paciente");
        return p;
    }

    @PostMapping
    public Persona crear(@RequestBody Persona paciente) {
        paciente.setRol(Rol.PACIENTE);
        String doc = paciente.getDocIden();
        if (doc != null && !doc.isBlank()) {
            var existente = repo.findByDocIden(doc);
            if (existente.isPresent()) { throw new ResponseStatusException(HttpStatus.CONFLICT, "Documento de identidad ya registrado"); }
        }
        return repo.save(paciente);
    }

    @PutMapping("/{id}")
    public Persona actualizar(@PathVariable Long id, @RequestBody Persona datos) {
        Persona p = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente no encontrado"));
        p.setNombreCompleto(datos.getNombreCompleto());
        p.setTelefono(datos.getTelefono());
        p.setEmail(datos.getEmail());
        p.setDireccion(datos.getDireccion());
        String nuevoDoc = datos.getDocIden();
        if (nuevoDoc != null && !nuevoDoc.isBlank() && (p.getDocIden() == null || !p.getDocIden().equals(nuevoDoc))) {
            var existente = repo.findByDocIden(nuevoDoc);
            if (existente.isPresent() && !existente.get().getIdPersona().equals(p.getIdPersona())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Documento de identidad ya registrado");
            }
            p.setDocIden(nuevoDoc);
        }
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PostMapping("/deduplicar")
    @Transactional
    public Map<String,Object> deduplicar() {
        List<Persona> pacientes = repo.findByRol(Rol.PACIENTE);
        Map<String, List<Persona>> porDoc = pacientes.stream()
                .filter(p -> p.getDocIden() != null && !p.getDocIden().isBlank())
                .collect(Collectors.groupingBy(Persona::getDocIden));
        int gruposDuplicados = 0;
        int eliminados = 0;
        for (Map.Entry<String, List<Persona>> e : porDoc.entrySet()) {
            List<Persona> lista = e.getValue();
            if (lista.size() <= 1) continue;
            gruposDuplicados++;
            Persona keeper = lista.stream().min((a,b) -> a.getIdPersona().compareTo(b.getIdPersona())).orElse(lista.get(0));
            for (Persona dup : lista) {
                if (dup.getIdPersona().equals(keeper.getIdPersona())) continue;
                List<com.ProyectoAula.Backend.model.Cita> citas = citaRepo.findByPaciente(dup);
                for (var c : citas) { c.setPaciente(keeper); citaRepo.save(c); }
                repo.delete(dup);
                eliminados++;
            }
        }
        return Map.of("gruposDuplicados", gruposDuplicados, "eliminados", eliminados);
    }
}
