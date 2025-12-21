<?php
require_once "cronometro.php";
session_start();

function guardarResultadoEnBD($tiempo) {
    $conexion = new mysqli(
        "localhost",
        "DBUSER2025",
        "DBPSWD2025",
        "UO283204_DB"
    );

    $stmt = $conexion->prepare(
        "INSERT INTO ResultadosTest 
         (id_usuario, dispositivo, tiempo_segundos, completado) 
         VALUES (?, ?, ?, ?)"
    );

    $id_usuario = $_SESSION["id_usuario"];
    $dispositivo = "Ordenador";
    $completado = true;

    $stmt->bind_param(
        "isdi",
        $id_usuario,
        $dispositivo,
        $tiempo,
        $completado
    );

    $stmt->execute();
    $stmt->close();
    $conexion->close();
}

function guardarObservacionFacilitador($comentarios) {
    $conexion = new mysqli(
        "localhost",
        "DBUSER2025",
        "DBPSWD2025",
        "UO283204_DB"
    );

    $stmt = $conexion->prepare(
        "INSERT INTO ObservacionesFacilitador 
         (id_usuario, comentarios_facilitador)
         VALUES (?, ?)"
    );

    $stmt->bind_param(
        "is",
        $_SESSION["id_usuario"],
        $comentarios
    );

    $stmt->execute();
    $stmt->close();
    $conexion->close();
}

if (!isset($_SESSION["estado"])) {
    $_SESSION["estado"] = "en_espera";
}

if (isset($_POST["iniciar"])) {
    $conexion = new mysqli(
        "localhost",
        "DBUSER2025",
        "DBPSWD2025",
        "UO283204_DB"
    );

    $stmt = $conexion->prepare(
        "INSERT INTO Usuarios (profesion, edad, genero, pericia_informatica)
         VALUES (?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "siss",
        $_POST["profesion"],
        $_POST["edad"],
        $_POST["genero"],
        $_POST["pericia"]
    );

    $stmt->execute();

    $_SESSION["id_usuario"] = $conexion->insert_id;

    $_SESSION["cronometro"] = new Cronometro();
    $_SESSION["cronometro"]->arrancar();

    $_SESSION["estado"] = "en_progreso";

    $stmt->close();
    $conexion->close();
}

if (isset($_POST["terminar"])) {
    if (isset($_SESSION["cronometro"])) {

        $_SESSION["cronometro"]->parar();
        $tiempoEmpleado = $_SESSION["cronometro"]->getTiempo();

        guardarResultadoEnBD($tiempoEmpleado);

        $_SESSION["estado"] = "observador";

        unset($_SESSION["cronometro"]);
    }
}

if (isset($_POST["guardar_observacion"])) {

    guardarObservacionFacilitador($_POST["comentarios"]);

    $_SESSION["estado"] = "en_espera";

    unset($_SESSION["id_usuario"]);
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
        <h1>MotoGP Desktop - Prueba de Usabilidad</h1>
    </header>

    <main>
        <section>
            <h2>Instrucciones</h2>
            <p>Responda a todas las preguntas basándose en la información disponible en la aplicación MotoGP Desktop.</p>
        </section>

        <?php if ($_SESSION["estado"] === "en_espera"): ?>
            <section>
                <h2>Datos personales:</h2>

                <form method="post">
                    <p>
                        <label>Profesión:</label>
                        <input type="text" name="profesion" required>
                    </p>

                    <p>
                        <label>Edad:</label>
                        <input type="number" name="edad" required>
                    </p>

                    <p>
                        <label>Género:</label>
                        <select name="genero" required>
                            <option value="">Seleccione una opción</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </p>

                    <p>
                        <label>Pericia informática:</label>
                        <select name="pericia" required>
                            <option value="">Seleccione una opción</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </p>

                    <button type="submit" name="iniciar">
                        Iniciar prueba
                    </button>
                </form>
            </section>
        <?php endif; ?>


        <?php if ($_SESSION["estado"] === "en_progreso"): ?>
            <section>
                <h2>Cuestionario:</h2>

                <form method="post">
                    <!-- Pregunta 1 -->
                    <p>
                        <label>1. ¿Quién es el piloto principal de la aplicación?</label>
                        <input type="text" name="p1" required>
                    </p>

                    <!-- Pregunta 2 -->
                    <p>
                        <label>2. ¿En qué circuito se disputa la carrera?</label>
                        <input type="text" name="p2" required>
                    </p>

                    <!-- Pregunta 3 -->
                    <p>
                        <label>3. ¿En qué país se encuentra el circuito?</label>
                        <input type="text" name="p3" required>
                    </p>

                    <!-- Pregunta 4 -->
                    <p>
                        <label>4. ¿Qué tipo de información muestra el documento de meteorología?</label>
                        <input type="text" name="p4" required>
                    </p>

                    <!-- Pregunta 5 -->
                    <p>
                        <label>5. ¿Qué información aparece en la página de clasificaciones?</label>
                        <input type="text" name="p5" required>
                    </p>

                    <!-- Pregunta 6 -->
                    <p>
                        <label>6. ¿Existe un juego de memoria en la aplicación?</label>
                        <select name="p6" required>
                            <option value="">Seleccione una opción</option>
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                        </select>
                    </p>

                    <!-- Pregunta 7 -->
                    <p>
                        <label>7. ¿El diseño es responsive?</label>
                        <select name="p7" required>
                            <option value="">Seleccione una opción</option>
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                        </select>
                    </p>

                    <!-- Pregunta 8 -->
                    <p>
                        <label>8. ¿Qué sección muestra información multimedia?</label>
                        <input type="text" name="p8" required>
                    </p>

                    <!-- Pregunta 9 -->
                    <p>
                        <label>9. ¿Es fácil encontrar la información principal?</label>
                        <select name="p9" required>
                            <option value="">Seleccione una opción</option>
                            <option value="Muy fácil">Muy fácil</option>
                            <option value="Fácil">Fácil</option>
                            <option value="Difícil">Difícil</option>
                            <option value="Difícil">Muy difícil</option>
                        </select>
                    </p>

                    <!-- Pregunta 10 -->
                    <p>
                        <label>10. ¿Recomendaría esta aplicación a otros usuarios?</label>
                        <select name="p10" required>
                            <option value="">Seleccione una opción</option>
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                        </select>
                    </p>

                    <button type="submit" name="terminar">
                        Terminar prueba
                    </button>
                </form>
            </section>
        <?php endif; ?>

        <?php if ($_SESSION["estado"] === "observador"): ?>
            <section>
                <h2>Observaciones del facilitador</h2>

                <form method="post">
                    <p>
                        <label>Comentarios del observador:</label><br>
                        <textarea name="comentarios" rows="5" cols="60" required></textarea>
                    </p>

                    <button type="submit" name="guardar_observacion">
                        Guardar observaciones
                    </button>
                </form>
            </section>
        <?php endif; ?>
    </main>
</body>
</html>
