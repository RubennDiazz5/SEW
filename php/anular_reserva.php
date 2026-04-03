<?php
session_start();
require_once("conexion.php");

if (!isset($_SESSION["id_usuario"])) {
    $_SESSION["mensaje_error"] = "Debe iniciar sesión para anular una reserva.";
    header("Location: ../reservas.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $_SESSION["mensaje_error"] = "Acceso no válido.";
    header("Location: ../reservas.php");
    exit();
}

$idUsuario = $_SESSION["id_usuario"];
$idReserva = isset($_POST["id_reserva"]) ? (int) $_POST["id_reserva"] : 0;

if ($idReserva <= 0) {
    $_SESSION["mensaje_error"] = "Identificador de reserva no válido.";
    header("Location: ../reservas.php");
    exit();
}

$bd = new ConexionBD();
$conexion = $bd->getConexion();

$conexion->begin_transaction();

try {
    $sqlReserva = "
        SELECT id_sesion, num_plazas, estado
        FROM reservas
        WHERE id_reserva = ? AND id_usuario = ?
        FOR UPDATE
    ";

    $stmtReserva = $conexion->prepare($sqlReserva);

    if (!$stmtReserva) {
        throw new Exception("Error al preparar la consulta de la reserva.");
    }

    $stmtReserva->bind_param("ii", $idReserva, $idUsuario);
    $stmtReserva->execute();
    $resultadoReserva = $stmtReserva->get_result();

    if ($resultadoReserva->num_rows === 0) {
        $stmtReserva->close();
        throw new Exception("La reserva no existe o no pertenece al usuario.");
    }

    $reserva = $resultadoReserva->fetch_assoc();
    $stmtReserva->close();

    if ($reserva["estado"] === "anulada") {
        throw new Exception("La reserva ya estaba anulada.");
    }

    $sqlAnular = "
        UPDATE reservas
        SET estado = 'anulada'
        WHERE id_reserva = ?
    ";

    $stmtAnular = $conexion->prepare($sqlAnular);

    if (!$stmtAnular) {
        throw new Exception("Error al preparar la anulación de la reserva.");
    }

    $stmtAnular->bind_param("i", $idReserva);
    $stmtAnular->execute();
    $stmtAnular->close();

    $sqlRestaurar = "
        UPDATE sesiones_recurso
        SET plazas_disponibles = plazas_disponibles + ?
        WHERE id_sesion = ?
    ";

    $stmtRestaurar = $conexion->prepare($sqlRestaurar);

    if (!$stmtRestaurar) {
        throw new Exception("Error al restaurar las plazas disponibles.");
    }

    $stmtRestaurar->bind_param("ii", $reserva["num_plazas"], $reserva["id_sesion"]);
    $stmtRestaurar->execute();
    $stmtRestaurar->close();

    $conexion->commit();

    $_SESSION["mensaje_exito"] = "La reserva se ha anulado correctamente.";

} catch (Exception $e) {
    $conexion->rollback();
    $_SESSION["mensaje_error"] = $e->getMessage();
}

$bd->cerrarConexion();

header("Location: ../reservas.php");
exit();
?>