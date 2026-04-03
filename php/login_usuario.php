<?php
session_start();
require_once("conexion.php");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $_SESSION["mensaje_error"] = "Acceso no válido.";
    header("Location: ../reservas.php");
    exit();
}

$email = trim($_POST["email"] ?? "");
$contrasena = $_POST["contrasena"] ?? "";

if (empty($email) || empty($contrasena)) {
    $_SESSION["mensaje_error"] = "Debe introducir el correo y la contraseña.";
    header("Location: ../reservas.php");
    exit();
}

$bd = new ConexionBD();
$conexion = $bd->getConexion();

try {
    $sql = "
        SELECT id_usuario, nombre, email, password_hash
        FROM usuarios
        WHERE email = ?
    ";

    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error al preparar el inicio de sesión.");
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 0) {
        $stmt->close();
        throw new Exception("No existe ningún usuario con ese correo.");
    }

    $usuario = $resultado->fetch_assoc();
    $stmt->close();

    if (!password_verify($contrasena, $usuario["password_hash"])) {
        throw new Exception("La contraseña es incorrecta.");
    }

    $_SESSION["id_usuario"] = $usuario["id_usuario"];
    $_SESSION["usuario"] = $usuario["email"];
    $_SESSION["nombre"] = $usuario["nombre"];
    $_SESSION["mensaje_exito"] = "Inicio de sesión realizado correctamente.";

} catch (Exception $e) {
    $_SESSION["mensaje_error"] = $e->getMessage();
}

$bd->cerrarConexion();

header("Location: ../reservas.php");
exit();
?>