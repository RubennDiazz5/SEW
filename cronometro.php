<?php
require_once "php/cronometro.php";
session_start();

if (!isset($_SESSION['cronometro'])) {
    $_SESSION['cronometro'] = new Cronometro();
}

$cronometro = $_SESSION['cronometro'];
$resultado = "";

if (isset($_POST['arrancar'])) {
    $cronometro->arrancar();
}

if (isset($_POST['parar'])) {
    $cronometro->parar();
}

if (isset($_POST['mostrar'])) {
    $resultado = $cronometro->mostrar();
}
?>

<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cronómetro PHP</title>
    <meta name="author" content="Rubén Díaz Zapico" />
    <meta name="description" content="Cronometro funcional con PHP" />
    <meta name="keywords" content="MotoGP Desktop, cronómetro PHP, cronómetro web, medición de tiempo, sesiones PHP, programación servidor, aplicación web dinámica, juegos MotoGP, desarrollo web PHP">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="multimedia/favicon.png">
</head>

<body>

<header>
    <h1><a href="index.html" title="Inicio de la página web">MotoGP Desktop</a></h1>

    <nav>
        <a href="index.html" title="Inicio de la página web">Inicio</a>
        <a href="piloto.html" title="Información del piloto">Piloto</a>
        <a href="circuito.html" title="Información del circuito">Circuito</a>
        <a href="meteorologia.html" title="Información de la meteorología">Meteorología</a>
        <a href="clasificaciones.php" title="Información de las clasificaciones">Clasificaciones</a>
        <a href="juegos.html" title="Información de los juegos" class="active">Juegos</a>
        <a href="ayuda.html" title="Información de la ayuda">Ayuda</a>
    </nav>
</header>

<p>Estás en: <a href="index.html" title="Inicio de la página web">Inicio</a> | Juegos | <strong>Cronómetro PHP</strong></p>

<section>
    <h2>Cronómetro</h2>

    <form method="post">
        <button type="submit" name="arrancar">Arrancar</button>
        <button type="submit" name="parar">Parar</button>
        <button type="submit" name="mostrar">Mostrar</button>
    </form>

    <?php if ($resultado !== ""): ?>
        <p><strong>Tiempo transcurrido:</strong> <?= $resultado ?></p>
    <?php endif; ?>
</section>

</body>
</html>
