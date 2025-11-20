-- ================================================
-- BASE DE DATOS DEL CONSULTORIO ODONTOLÓGICO
-- Incluye: PACIENTES, MÉDICOS, CITAS, SERVICIOS y ODONTOGRAMA
-- Normalización hasta 3FN
-- ================================================

-- Charset unicode para acentos y emojis
CREATE DATABASE IF NOT EXISTS `COP_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `COP_db`;

-- ============================================================
-- TABLA: PACIENTES
-- ============================================================
CREATE TABLE IF NOT EXISTS `PACIENTES` (
  `ID_P` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `Doc_Iden` VARCHAR(50) NOT NULL UNIQUE,
  `NombreCompleto` VARCHAR(150) NOT NULL,
  `Telefono` VARCHAR(30),
  `Email` VARCHAR(100),
  `Direccion` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: MEDICOS
-- ============================================================
CREATE TABLE IF NOT EXISTS `MEDICOS` (
  `ID_Medico` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `NombreCompleto` VARCHAR(150) NOT NULL,
  `Telefono` VARCHAR(30),
  `Email` VARCHAR(100),
  `Certificado` VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: SERVICIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS `SERVICIOS` (
  `ID_Servicio` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `TipoServicio` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: CITAS
-- ============================================================
CREATE TABLE IF NOT EXISTS `CITAS` (
  `ID_Cita` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `Fecha` DATE NOT NULL,
  `Hora` TIME NOT NULL,
  `Direccion` VARCHAR(255),
  `ID_P` INT UNSIGNED NOT NULL,
  `ID_Medico` INT UNSIGNED NOT NULL,
  CONSTRAINT `FK_CITA_PACIENTE`
    FOREIGN KEY (`ID_P`) REFERENCES `PACIENTES` (`ID_P`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_CITA_MEDICO`
    FOREIGN KEY (`ID_Medico`) REFERENCES `MEDICOS` (`ID_Medico`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: MEDICO_SERVICIO (Relación N:M entre MEDICOS y SERVICIOS)
-- ============================================================
CREATE TABLE IF NOT EXISTS `MEDICO_SERVICIO` (
  `ID_Medico` INT UNSIGNED NOT NULL,
  `ID_Servicio` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`ID_Medico`,`ID_Servicio`),
  CONSTRAINT `FK_MS_MEDICO`
    FOREIGN KEY (`ID_Medico`) REFERENCES `MEDICOS` (`ID_Medico`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_MS_SERVICIO`
    FOREIGN KEY (`ID_Servicio`) REFERENCES `SERVICIOS` (`ID_Servicio`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: CITA_SERVICIO (Relación N:M entre CITAS y SERVICIOS)
-- ============================================================
CREATE TABLE IF NOT EXISTS `CITA_SERVICIO` (
  `ID_Cita` INT UNSIGNED NOT NULL,
  `ID_Servicio` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`ID_Cita`,`ID_Servicio`),
  CONSTRAINT `FK_CS_CITA`
    FOREIGN KEY (`ID_Cita`) REFERENCES `CITAS` (`ID_Cita`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_CS_SERVICIO`
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

-- Tabla: ODONTOGRAMAS (un odontograma por paciente o por cita)
CREATE TABLE IF NOT EXISTS `ODONTOGRAMAS` (
  `ID_Odontograma` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `FechaRegistro` DATE NOT NULL,
  `ObservacionesGenerales` TEXT,
  `ID_P` INT UNSIGNED NOT NULL,
  CONSTRAINT `FK_ODONTO_PACIENTE`
    FOREIGN KEY (`ID_P`) REFERENCES `PACIENTES` (`ID_P`)
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

