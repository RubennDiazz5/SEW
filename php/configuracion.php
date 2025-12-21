<?php
class Configuracion {
    
    private $servidor = "localhost";
    private $usuario = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $bd = "UO283204_DB";
    private $conexion;

    public function __construct() {
        $this->conexion = new mysqli(
            $this->servidor,
            $this->usuario,
            $this->password
        );

        if ($this->conexion->connect_error) {
            die("Error de conexión: " . $this->conexion->connect_error);
        }
    }

    public function reiniciarBD() {
        $this->conexion->select_db($this->bd);

        $tablas = [
            "ObservacionesFacilitador",
            "ResultadosTest",
            "Usuarios"
        ];

        foreach ($tablas as $tabla) {
            $this->conexion->query("DELETE FROM $tabla");
        }

        return "Base de datos reiniciada correctamente.";
    }

    public function eliminarBD() {
        $this->conexion->query("DROP DATABASE IF EXISTS " . $this->bd);
        return "Base de datos eliminada completamente.";
    }

    public function exportarCSV() {
        $this->conexion->select_db($this->bd);

        $resultado = $this->conexion->query(
            "SELECT * FROM ResultadosTest"
        );

        if (!$resultado || $resultado->num_rows === 0) {
            return "No hay datos en la tabla ResultadosTest para exportar.";
        }

        $archivo = fopen("datos.csv", "w");

        fputcsv($archivo, array_keys($resultado->fetch_assoc()));
        $resultado->data_seek(0);

        while ($fila = $resultado->fetch_assoc()) {
            fputcsv($archivo, $fila);
        }

        fclose($archivo);

        return "Datos exportados correctamente a CSV.";
    }
}

$config = new Configuracion();

$mensaje = "";

if (isset($_POST["reiniciar"])) {
    $mensaje = $config->reiniciarBD();
}

if (isset($_POST["eliminar"])) {
    $mensaje = $config->eliminarBD();
}

if (isset($_POST["exportar"])) {
    $mensaje = $config->exportarCSV();
}
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Configuración BD (Usabilidad)</title>
    <meta name="author" content="Rubén Díaz Zapico" />
    <meta name="description" content="Documento para utilizar en otros módulos de la asignatura" />
    <meta name="keywords" content="Inicio, Piloto, Circuito, Meteorología, Clasificaciones, Juegos, Ayuda"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/favicon.png" />
</head>

<body>
    <header>
        <h1>MotoGP Desktop - Configuracion de la BD</h1>
    </header>

    <main>
        <section>
            <h2>Gestión de la base de datos</h2>

            <form method="post">
                <button type="submit" name="reiniciar">
                    Reiniciar base de datos
                </button>

                <button type="submit" name="exportar">
                    Exportar datos a CSV
                </button>

                <button type="submit" name="eliminar"
                        onclick="return confirm('¿Seguro que quieres borrar la base de datos?')">
                    Eliminar base de datos
                </button>
            </form>

            <?php if ($mensaje): ?>
                <p><strong><?= $mensaje ?></strong></p>
            <?php endif; ?>
        </section>
    </main>
</body>
</html>
