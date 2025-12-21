<?php
class Clasificacion {

    private string $documento;

    public function __construct() {
        $this->documento = "xml/circuitoEsquema.xml";
    }

    public function consultar(): ?SimpleXMLElement {
        $datos = file_get_contents($this->documento);

        if ($datos === false) {
            echo "<p>Error al leer el archivo XML</p>";
            return null;
        }

        $xml = new SimpleXMLElement($datos);

        return $xml;
    }

    public function mostrarGanador(): void {
        $xml = $this->consultar();

        if ($xml === null) return;

        $ganador = $xml->ganador;

        if ($ganador) {
            echo "<section>";
            echo "<h3>Ganador:</h3>";
            echo "<ul>";
            echo "<li>Piloto: {$ganador->piloto}</li>";
            echo "<li>Tiempo: {$ganador->tiempo}</li>";
            echo "</ul>";
            echo "</section>";
        }
    }

}

$clasificacion = new Clasificacion();
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Clasificaciones</title>
    <meta name="author" content="Rubén Díaz Zapico" />
    <meta name="description" content="Documento para ver el ganador de la carrera del circuito del proyecto" />
    <meta name="keywords" content="MotoGP Desktop, clasificaciones MotoGP, ganador carrera MotoGP, resultados circuito, clasificación carrera, archivo XML, SimpleXML PHP, piloto ganador, tiempo de carrera, desarrollo web PHP, Marco Bezzecchi">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon.png" />
</head>

<body>
    <header>
        <h1><a href="index.html" title="Inicio de la página web">MotoGP Desktop</a></h1>

        <nav>
            <a href="index.html" title="Inicio de la página web">Inicio</a>
            <a href="piloto.html" title="Información del piloto">Piloto</a>
            <a href="circuito.html" title="Información del circuito">Circuito</a>
            <a href="meteorologia.html" title="Información de la meteorología">Meteorología</a>
            <a href="clasificaciones.php" title="Información de las clasificaciones" class="active">Clasificaciones</a>
            <a href="juegos.html" title="Información de los juegos">Juegos</a>
            <a href="ayuda.html" title="Información de la ayuda">Ayuda</a>
        </nav>
    </header>

    <p>Estás en: <a href="index.html" title="Inicio de la página web">Inicio</a> | <strong>Clasificaciones</strong></p>

    <main>
        <h2>Clasificaciones de MotoGP-Desktop</h2>

        <?php
            $clasificacion->mostrarGanador();
        ?>
    </main>
</body>
</html>
