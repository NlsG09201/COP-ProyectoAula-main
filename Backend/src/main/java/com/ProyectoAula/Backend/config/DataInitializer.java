package com.ProyectoAula.Backend.config;

import com.ProyectoAula.Backend.model.Diente;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Servicio;
import com.ProyectoAula.Backend.model.TipoServicio;
import com.ProyectoAula.Backend.model.Persona.Rol;
import com.ProyectoAula.Backend.repository.DienteRepository;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import com.ProyectoAula.Backend.repository.ServicioRepository;
import com.ProyectoAula.Backend.repository.TipoServicioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DienteRepository dienteRepository;
    private final PersonaRepository personaRepository;
    private final PasswordEncoder passwordEncoder;
    private final TipoServicioRepository tipoRepo;
    private final ServicioRepository servicioRepo;

    public DataInitializer(DienteRepository dienteRepository, PersonaRepository personaRepository, PasswordEncoder passwordEncoder,
                           TipoServicioRepository tipoRepo, ServicioRepository servicioRepo) {
        this.dienteRepository = dienteRepository;
        this.personaRepository = personaRepository;
        this.passwordEncoder = passwordEncoder;
        this.tipoRepo = tipoRepo;
        this.servicioRepo = servicioRepo;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Solo inicializar si no hay dientes en la base de datos
        if (dienteRepository.count() == 0) {
            initializeDientes();
        }
        
        // Crear usuarios por defecto solo si no existen
        createDoctorIfNotExists("juanperez", "Dr. Juan Pérez", "juan.perez@cop.local", "3111234567", "perez123");
        createDoctorIfNotExists("analopez", "Dra. Ana López", "ana.lopez@cop.local", "3201234567", "lopez123");
        createDoctorIfNotExists("admin", "Administrador Sistema", "admin@cop.local", "3000000000", "admin123");

        seedServiciosOdonto();
        seedServiciosPsico();
        seedProfesionalesPsico();
    }

    private void createDoctorIfNotExists(String username, String nombre, String email, String tel, String pass) {
        if (personaRepository.findByUsername(username).isEmpty()) {
            Persona p = new Persona();
            p.setRol(Rol.MEDICO);
            p.setNombreCompleto(nombre);
            p.setEmail(email);
            p.setTelefono(tel);
            p.setDireccion("Clínica COP Sede Principal");
            p.setUsername(username);
            p.setPasswordHash(passwordEncoder.encode(pass));
            personaRepository.save(p);
            System.out.println("✅ Usuario creado: user=" + username + " pass=" + pass);
        } else {
            System.out.println("ℹ️ El usuario " + username + " ya existe.");
        }
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

    private void seedServiciosPsico() {
        TipoServicio psClinica = tipoRepo.findByNombre("Psicología Clínica").orElseGet(() -> {
            TipoServicio ts = new TipoServicio(); ts.setNombre("Psicología Clínica"); return tipoRepo.save(ts);
        });
        TipoServicio psInfantil = tipoRepo.findByNombre("Psicología Infantil").orElseGet(() -> {
            TipoServicio ts = new TipoServicio(); ts.setNombre("Psicología Infantil"); return tipoRepo.save(ts);
        });
        TipoServicio psPareja = tipoRepo.findByNombre("Psicoterapia de Pareja").orElseGet(() -> {
            TipoServicio ts = new TipoServicio(); ts.setNombre("Psicoterapia de Pareja"); return tipoRepo.save(ts);
        });

        createServicio("Terapia Individual", psClinica);
        createServicio("Evaluación Psicológica", psClinica);
        createServicio("Terapia Infantil", psInfantil);
        createServicio("Terapia de Pareja", psPareja);
    }

    private void seedProfesionalesPsico() {
        if (personaRepository.findByUsername("meivi").isPresent()) {
            System.out.println("ℹ️ La profesional meivi ya existe.");
            return;
        }
        Persona psicologa = new Persona();
        psicologa.setRol(Rol.MEDICO);
        psicologa.setNombreCompleto("Dra. Meivi Gonzales");
        psicologa.setEmail("meivi.gonzales@cop.local");
        psicologa.setTelefono("3001234567");
        psicologa.setDireccion("Clínica COP Sede Bienestar");
        psicologa.setUsername("meivi");
        psicologa.setPasswordHash(passwordEncoder.encode("meivi123"));
        psicologa.setHoraInicioDisponibilidad(java.time.LocalTime.of(9, 0));
        psicologa.setHoraFinDisponibilidad(java.time.LocalTime.of(17, 0));
        psicologa.setDiasDisponibles("MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY");
        
        Servicio s1 = servicioRepo.findByNombre("Terapia Individual").orElse(null);
        Servicio s2 = servicioRepo.findByNombre("Evaluación Psicológica").orElse(null);
        Servicio s3 = servicioRepo.findByNombre("Terapia Infantil").orElse(null);
        Servicio s4 = servicioRepo.findByNombre("Terapia de Pareja").orElse(null);
        java.util.List<Servicio> lista = new java.util.ArrayList<>();
        if (s1 != null) lista.add(s1);
        if (s2 != null) lista.add(s2);
        if (s3 != null) lista.add(s3);
        if (s4 != null) lista.add(s4);
        psicologa.setServicios(lista);
        
        personaRepository.save(psicologa);
        System.out.println("✅ Profesional psicología creada: meivi");
    }
}
