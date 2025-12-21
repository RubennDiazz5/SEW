-- Crear base de datos
CREATE DATABASE IF NOT EXISTS UO283204_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE UO283204_DB;

-- Tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    profesion VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    genero ENUM('M','F','Otro') NOT NULL,
    pericia_informatica ENUM('Baja','Media','Alta') NOT NULL
);

-- Tabla ResultadosTest
CREATE TABLE ResultadosTest (
    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    dispositivo ENUM('Ordenador','Tableta','Teléfono') NOT NULL,
    tiempo_segundos FLOAT NOT NULL,
    completado BOOLEAN NOT NULL,
    comentarios_usuario TEXT,
    propuestas_mejora TEXT,
    valoracion INT CHECK (valoracion BETWEEN 0 AND 10),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla ObservacionesFacilitador
CREATE TABLE ObservacionesFacilitador (
    id_observacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    comentarios_facilitador TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);
