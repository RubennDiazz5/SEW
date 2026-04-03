CREATE DATABASE IF NOT EXISTS UO283204_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE UO283204_DB;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tipos_recurso (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE recursos_turisticos (
    id_recurso INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(150) NOT NULL,
    precio DECIMAL(8,2) NOT NULL CHECK (precio >= 0),
    plazas_totales INT NOT NULL CHECK (plazas_totales > 0),
    activo TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT fk_recurso_tipo
        FOREIGN KEY (id_tipo) REFERENCES tipos_recurso(id_tipo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE sesiones_recurso (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,
    id_recurso INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    plazas_disponibles INT NOT NULL CHECK (plazas_disponibles >= 0),
    CONSTRAINT fk_sesion_recurso
        FOREIGN KEY (id_recurso) REFERENCES recursos_turisticos(id_recurso)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT chk_fechas_sesion
        CHECK (fecha_fin > fecha_inicio)
);

CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_sesion INT NOT NULL,
    num_plazas INT NOT NULL CHECK (num_plazas > 0),
    precio_unitario DECIMAL(8,2) NOT NULL CHECK (precio_unitario >= 0),
    importe_total DECIMAL(10,2) NOT NULL CHECK (importe_total >= 0),
    fecha_reserva DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('confirmada', 'anulada') NOT NULL DEFAULT 'confirmada',
    CONSTRAINT fk_reserva_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_reserva_sesion
        FOREIGN KEY (id_sesion) REFERENCES sesiones_recurso(id_sesion)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE presupuestos (
    id_presupuesto INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL UNIQUE,
    concepto VARCHAR(255) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    iva DECIMAL(10,2) NOT NULL CHECK (iva >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    CONSTRAINT fk_presupuesto_reserva
        FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);