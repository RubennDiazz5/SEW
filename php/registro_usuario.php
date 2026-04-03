<?php
session_start();
require_once("conexion.php");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $_SESSION["mensaje_error"] = "Acceso no válido.";
    header("Location: ../reservas.php");
    exit();
}

$nombre = trim($_POST["nombre"] ?? "");
$apellidos = trim($_POST["apellidos"] ?? "");
$email = trim($_POST["email"] ?? "");
$telefono = trim($_POST["telefono"] ?? "");
$passwordPlano = $_POST["contrasena"] ?? "";

if (
    empty($nombre) ||
    empty($apellidos) ||
    empty($email) ||
    empty($passwordPlano)
) {
    $_SESSION["mensaje_error"] = "Faltan datos obligatorios.";
    header("Location: ../reservas.php");
    exit();
}

$passwordHash = password_hash($passwordPlano, PASSWORD_DEFAULT);

$bd = new ConexionBD();
$conexion = $bd->getConexion();

try {
    $consultaExiste = $conexion->prepare(
        "SELECT id_usuario FROM usuarios WHERE email = ?"
    );

    if (!$consultaExiste) {
        throw new Exception("Error en la consulta de comprobación.");
    }

    $consultaExiste->bind_param("s", $email);
    $consultaExiste->execute();
    $resultadoExiste = $consultaExiste->get_result();

    if ($resultadoExiste->num_rows > 0) {
        $consultaExiste->close();
        throw new Exception("Ya existe un usuario registrado con ese correo.");
    }

    $consultaExiste->close();

    $sql = "INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono)
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error al preparar la inserción.");
    }

    $stmt->bind_param("sssss", $nombre, $apellidos, $email, $passwordHash, $telefono);

    if (!$stmt->execute()) {
        throw new Exception("Error al registrar el usuario.");
    }

    $_SESSION["id_usuario"] = $stmt->insert_id;
    $_SESSION["usuario"] = $email;
    $_SESSION["nombre"] = $nombre;
    $_SESSION["mensaje_exito"] = "Usuario registrado correctamente. Bienvenido, " . $nombre . ".";

    $stmt->close();

} catch (Exception $e) {
    $_SESSION["mensaje_error"] = $e->getMessage();
}

$bd->cerrarConexion();

header("Location: ../reservas.php");
exit();
?>