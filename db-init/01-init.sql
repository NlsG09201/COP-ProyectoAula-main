CREATE DATABASE IF NOT EXISTS `COP_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `COP_db`;

-- ============================================================
-- TABLA: PERSONAS (unifica PACIENTES y MEDICOS)
-- ============================================================
CREATE TABLE IF NOT EXISTS `PERSONAS` (
  `ID_Persona` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `Doc_Iden` VARCHAR(50) UNIQUE,
  `NombreCompleto` VARCHAR(150) NOT NULL,
  `Telefono` VARCHAR(30),
  `Email` VARCHAR(100),
  `Direccion` VARCHAR(255),
  `Rol` ENUM('MEDICO','PACIENTE') NOT NULL,
  `Certificado` VARCHAR(200),
  `HoraInicioDisponibilidad` TIME,
  `HoraFinDisponibilidad` TIME,
  `DiasDisponibles` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: TIPOSERVICIO
-- ============================================================
CREATE TABLE IF NOT EXISTS `TIPOSERVICIO` (
  `ID_TipoServicio` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `Nombre` VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: SERVICIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS `SERVICIOS` (
  `ID_Servicio` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ID_TipoServicio` INT UNSIGNED NOT NULL,
  CONSTRAINT `FK_SERVICIO_TIPO`
    FOREIGN KEY (`ID_TipoServicio`) REFERENCES `TIPOSERVICIO` (`ID_TipoServicio`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: CITAS (Servicio único por Cita)
-- ============================================================
CREATE TABLE IF NOT EXISTS `CITAS` (
  `ID_Cita` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `Fecha` DATE NOT NULL,
  `Hora` TIME NOT NULL,
  `Direccion` VARCHAR(255),
  `ID_Paciente` INT UNSIGNED NOT NULL,
  `ID_Medico` INT UNSIGNED NOT NULL,
  `ID_Servicio` INT UNSIGNED NOT NULL,
  CONSTRAINT `FK_CITA_PACIENTE`
    FOREIGN KEY (`ID_Paciente`) REFERENCES `PERSONAS` (`ID_Persona`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_CITA_MEDICO`
    FOREIGN KEY (`ID_Medico`) REFERENCES `PERSONAS` (`ID_Persona`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_CITA_SERVICIO`
    FOREIGN KEY (`ID_Servicio`) REFERENCES `SERVICIOS` (`ID_Servicio`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: MEDICO_SERVICIO (Relación N:M entre PERSONAS(Médico) y SERVICIOS)
-- ============================================================
CREATE TABLE IF NOT EXISTS `MEDICO_SERVICIO` (
  `ID_Persona` INT UNSIGNED NOT NULL,
  `ID_Servicio` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`ID_Persona`,`ID_Servicio`),
  CONSTRAINT `FK_MS_PERSONA`
    FOREIGN KEY (`ID_Persona`) REFERENCES `PERSONAS` (`ID_Persona`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_MS_SERVICIO`
    FOREIGN KEY (`ID_Servicio`) REFERENCES `SERVICIOS` (`ID_Servicio`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- MÓDULO DE ODONTOGRAMA
-- ============================================================

-- Tabla: DIENTES (Catálogo con dientes del 11 al 48 según FDI)
CREATE TABLE IF NOT EXISTS `DIENTES` (
  `ID_Diente` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `CodigoFDI` VARCHAR(5) NOT NULL UNIQUE,
  `Nombre` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ODONTOGRAMAS` (
  `ID_Odontograma` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `FechaRegistro` DATE NOT NULL,
  `ObservacionesGenerales` TEXT,
  `ID_Paciente` INT UNSIGNED NOT NULL,
  CONSTRAINT `FK_ODONTO_PACIENTE`
    FOREIGN KEY (`ID_Paciente`) REFERENCES `PERSONAS` (`ID_Persona`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: DETALLE_ODONTOGRAMA (Estado de cada diente)
CREATE TABLE IF NOT EXISTS `DETALLE_ODONTOGRAMA` (
  `ID_Detalle` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ID_Odontograma` INT UNSIGNED NOT NULL,
  `ID_Diente` INT UNSIGNED NOT NULL,
  `Estado` ENUM('Sano','Cariado','Restaurado','Ausente','Endodoncia','Implante') DEFAULT 'Sano',
  `Observacion` VARCHAR(255),
  CONSTRAINT `FK_DO_ODONTOGRAMA`
    FOREIGN KEY (`ID_Odontograma`) REFERENCES `ODONTOGRAMAS` (`ID_Odontograma`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_DO_DIENTE`
    FOREIGN KEY (`ID_Diente`) REFERENCES `DIENTES` (`ID_Diente`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `UQ_Diente_Odontograma` (`ID_Odontograma`, `ID_Diente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: TESTIMONIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS `TESTIMONIOS` (
  `ID_Testimonio` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `Nombre` VARCHAR(150) NOT NULL,
  `Comentario` TEXT NOT NULL,
  `Calificacion` TINYINT NOT NULL CHECK (Calificacion BETWEEN 1 AND 5),
  `FechaCreacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ID_Servicio` INT UNSIGNED NOT NULL,
  CONSTRAINT `FK_TESTIMONIO_SERVICIO`
    FOREIGN KEY (`ID_Servicio`) REFERENCES `SERVICIOS` (`ID_Servicio`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_fecha` (`FechaCreacion`),
  INDEX `idx_calificacion` (`Calificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
