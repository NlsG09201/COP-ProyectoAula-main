package com.ProyectoAula.Backend.config;

import com.ProyectoAula.Backend.model.Diente;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Servicio;
import com.ProyectoAula.Backend.model.Testimonio;
import com.ProyectoAula.Backend.model.TipoServicio;
import com.ProyectoAula.Backend.model.Persona.Rol;
import com.ProyectoAula.Backend.repository.DienteRepository;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import com.ProyectoAula.Backend.repository.ServicioRepository;
import com.ProyectoAula.Backend.repository.TipoServicioRepository;
import com.ProyectoAula.Backend.repository.TestimonioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DienteRepository dienteRepository;
    private final PersonaRepository personaRepository;
    private final PasswordEncoder passwordEncoder;
    private final TipoServicioRepository tipoRepo;
    private final ServicioRepository servicioRepo;
    private final TestimonioRepository testimonioRepo;

    public DataInitializer(DienteRepository dienteRepository, PersonaRepository personaRepository, PasswordEncoder passwordEncoder,
                           TipoServicioRepository tipoRepo, ServicioRepository servicioRepo, TestimonioRepository testimonioRepo) {
        this.dienteRepository = dienteRepository;
        this.personaRepository = personaRepository;
        this.passwordEncoder = passwordEncoder;
        this.tipoRepo = tipoRepo;
        this.servicioRepo = servicioRepo;
        this.testimonioRepo = testimonioRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        // Solo inicializar si no hay dientes en la base de datos
        if (dienteRepository.count() == 0) {
            initializeDientes();
        }
        if (personaRepository.findByRol(Rol.MEDICO).isEmpty()) {
            Persona m = new Persona();
            m.setRol(Rol.MEDICO);
            m.setNombreCompleto("Dr. Demo");
            m.setEmail("medico@example.com");
            m.setTelefono("3000000000");
            m.setDireccion("Clínica COP");
            m.setUsername("medico1");
            m.setPasswordHash(passwordEncoder.encode("medico123"));
            personaRepository.save(m);
        }

        if (personaRepository.findByUsername("testmedico").isEmpty()) {
            Persona t = new Persona();
            t.setRol(Rol.MEDICO);
            t.setNombreCompleto("Medico Test");
            t.setEmail("tester@example.com");
            t.setTelefono("3001111111");
            t.setDireccion("Clínica COP");
            t.setUsername("testmedico");
            t.setPasswordHash(passwordEncoder.encode("test123"));
            personaRepository.save(t);
        }

        seedServiciosOdonto();
        seedTestimonios();
        seedPacientes();
    }

    private void initializeDientes() {
        // Dientes permanentes según notación FDI (32 dientes)
        String[][] dientesData = {
            // Cuadrante 1 (Superior derecho)
            {"18", "Tercer molar superior derecho"},
            {"17", "Segundo molar superior derecho"},
            {"16", "Primer molar superior derecho"},
            {"15", "Segundo premolar superior derecho"},
            {"14", "Primer premolar superior derecho"},
            {"13", "Canino superior derecho"},
            {"12", "Incisivo lateral superior derecho"},
            {"11", "Incisivo central superior derecho"},
            
            // Cuadrante 2 (Superior izquierdo)
            {"21", "Incisivo central superior izquierdo"},
            {"22", "Incisivo lateral superior izquierdo"},
            {"23", "Canino superior izquierdo"},
            {"24", "Primer premolar superior izquierdo"},
            {"25", "Segundo premolar superior izquierdo"},
            {"26", "Primer molar superior izquierdo"},
            {"27", "Segundo molar superior izquierdo"},
            {"28", "Tercer molar superior izquierdo"},
            
            // Cuadrante 3 (Inferior izquierdo)
            {"38", "Tercer molar inferior izquierdo"},
            {"37", "Segundo molar inferior izquierdo"},
            {"36", "Primer molar inferior izquierdo"},
            {"35", "Segundo premolar inferior izquierdo"},
            {"34", "Primer premolar inferior izquierdo"},
            {"33", "Canino inferior izquierdo"},
            {"32", "Incisivo lateral inferior izquierdo"},
            {"31", "Incisivo central inferior izquierdo"},
            
            // Cuadrante 4 (Inferior derecho)
            {"41", "Incisivo central inferior derecho"},
            {"42", "Incisivo lateral inferior derecho"},
            {"43", "Canino inferior derecho"},
            {"44", "Primer premolar inferior derecho"},
            {"45", "Segundo premolar inferior derecho"},
            {"46", "Primer molar inferior derecho"},
            {"47", "Segundo molar inferior derecho"},
            {"48", "Tercer molar inferior derecho"}
        };

        for (String[] dienteData : dientesData) {
            Diente diente = new Diente();
            diente.setCodigoFDI(dienteData[0]);
            diente.setNombre(dienteData[1]);
            dienteRepository.save(diente);
        }

        System.out.println("✅ Inicializados 32 dientes en la base de datos");
    }

    private void seedServiciosOdonto() {
        TipoServicio odGeneral = tipoRepo.findByNombre("Odontología General").orElseGet(() -> {
            TipoServicio ts = new TipoServicio(); ts.setNombre("Odontología General"); return tipoRepo.save(ts);
        });
        TipoServicio ortodoncia = tipoRepo.findByNombre("Ortodoncia").orElseGet(() -> {
            TipoServicio ts = new TipoServicio(); ts.setNombre("Ortodoncia"); return tipoRepo.save(ts);
        });
        TipoServicio estetica = tipoRepo.findByNombre("Estética Dental").orElseGet(() -> {
            TipoServicio ts = new TipoServicio(); ts.setNombre("Estética Dental"); return tipoRepo.save(ts);
        });
        TipoServicio implantes = tipoRepo.findByNombre("Implantes Dentales").orElseGet(() -> {
            TipoServicio ts = new TipoServicio(); ts.setNombre("Implantes Dentales"); return tipoRepo.save(ts);
        });

        createServicio("Limpieza y Profilaxis", odGeneral);
        createServicio("Empastes y Restauraciones", odGeneral);
        createServicio("Endodoncias (tratamientos de conducto)", odGeneral);
        createServicio("Extracciones Dentales", odGeneral);

        createServicio("Brackets Metálicos", ortodoncia);
        createServicio("Brackets Estéticos (Cerámica, Zafiro)", ortodoncia);
        createServicio("Ortodoncia Invisible (Aligners)", ortodoncia);
        createServicio("Retenedores", ortodoncia);

        createServicio("Blanqueamiento Dental", estetica);
        createServicio("Carillas de Porcelana y Resina", estetica);
        createServicio("Coronas Dentales", estetica);
        createServicio("Contorneado Estético", estetica);

        createServicio("Implantes de Titanio", implantes);
        createServicio("Coronas sobre Implantes", implantes);
        createServicio("Puentes sobre Implantes", implantes);
        createServicio("Regeneración Ósea", implantes);
    }

    private void createServicio(String nombre, TipoServicio tipo) {
        if (servicioRepo.findByNombre(nombre).isPresent()) return;
        Servicio s = new Servicio();
        s.setNombre(nombre);
        s.setTipoServicio(tipo);
        servicioRepo.save(s);
    }

    private void seedTestimonios() {
        long count = testimonioRepo.count();
        if (count >= 2000) return;
        var servicios = servicioRepo.findAll();
        if (servicios.isEmpty()) return;
        int toCreate = (int)(2000 - count);
        java.util.Random rnd = new java.util.Random(12345);
        java.util.ArrayList<Testimonio> batch = new java.util.ArrayList<>();
        for (int i = 0; i < toCreate; i++) {
            Testimonio t = new Testimonio();
            t.setNombre("Usuario " + (count + i + 1));
            t.setComentario("Excelente atención y servicio " + (count + i + 1));
            t.setCalificacion(1 + rnd.nextInt(5));
            Servicio s = servicios.get(rnd.nextInt(servicios.size()));
            t.setServicio(s);
            batch.add(t);
        }
        testimonioRepo.saveAll(batch);
    }

    private void seedPacientes() {
        int existentes = personaRepository.findByRol(Rol.PACIENTE).size();
        if (existentes >= 2000) return;
        int toCreate = 2000 - existentes;
        java.util.ArrayList<Persona> nuevos = new java.util.ArrayList<>();
        for (int i = 0; i < toCreate; i++) {
            int idx = existentes + i + 1;
            Persona p = new Persona();
            p.setRol(Rol.PACIENTE);
            p.setDocIden(String.format("DOC-%07d", idx));
            p.setNombreCompleto("Paciente " + idx);
            p.setTelefono(String.format("300%07d", idx));
            p.setEmail("paciente" + idx + "@example.com");
            p.setDireccion("Ciudad COP");
            nuevos.add(p);
        }
        personaRepository.saveAll(nuevos);
    }
}
