package com.ProyectoAula.Backend.config;

import com.ProyectoAula.Backend.model.Diente;
import com.ProyectoAula.Backend.model.Persona;
import com.ProyectoAula.Backend.model.Persona.Rol;
import com.ProyectoAula.Backend.repository.DienteRepository;
import com.ProyectoAula.Backend.repository.PersonaRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DienteRepository dienteRepository;
    private final PersonaRepository personaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(DienteRepository dienteRepository, PersonaRepository personaRepository, PasswordEncoder passwordEncoder) {
        this.dienteRepository = dienteRepository;
        this.personaRepository = personaRepository;
        this.passwordEncoder = passwordEncoder;
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
}
