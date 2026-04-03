<?php
class ConexionBD {
    private string $servidor = "localhost";
    private string $usuario = "DBUSER2026";
    private string $password = "DBPWD2026";
    private string $baseDatos = "UO283204_DB";
    private mysqli $conexion;

    public function __construct() {
        $this->conexion = new mysqli(
            $this->servidor,
            $this->usuario,
            $this->password,
            $this->baseDatos
        );

        if ($this->conexion->connect_error) {
            die("Error de conexión: " . $this->conexion->connect_error);
        }
    }

    public function getConexion(): mysqli {
        return $this->conexion;
    }

    public function cerrarConexion(): void {
        $this->conexion->close();
    }
}
?>