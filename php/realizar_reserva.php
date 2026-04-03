<?php
session_start();
require_once("conexion.php");

if (!isset($_SESSION["id_usuario"])) {
    $_SESSION["mensaje_error"] = "Debe iniciar sesión para realizar una reserva.";
    header("Location: ../reservas.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    $_SESSION["mensaje_error"] = "Acceso no válido.";
    header("Location: ../reservas.php");
    exit();
}

$idUsuario = $_SESSION["id_usuario"];
$idSesion = isset($_POST["id_sesion"]) ? (int) $_POST["id_sesion"] : 0;
$numPlazas = isset($_POST["num_plazas"]) ? (int) $_POST["num_plazas"] : 0;

if ($idSesion <= 0 || $numPlazas <= 0) {
    $_SESSION["mensaje_error"] = "Datos de reserva no válidos.";
    header("Location: ../reservas.php");
    exit();
}

$bd = new ConexionBD();
$conexion = $bd->getConexion();

$conexion->begin_transaction();

try {
    $sqlSesion = "
        SELECT s.id_sesion, s.plazas_disponibles, r.precio, r.nombre
        FROM sesiones_recurso s
        INNER JOIN recursos_turisticos r ON s.id_recurso = r.id_recurso
        WHERE s.id_sesion = ?
        FOR UPDATE
    ";

    $stmtSesion = $conexion->prepare($sqlSesion);
    if (!$stmtSesion) {
        throw new Exception("Error al preparar la consulta de la sesión.");
    }

    $stmtSesion->bind_param("i", $idSesion);
    $stmtSesion->execute();
    $resultadoSesion = $stmtSesion->get_result();

    if ($resultadoSesion->num_rows === 0) {
        $stmtSesion->close();
        throw new Exception("La sesión seleccionada no existe.");
    }

    $sesion = $resultadoSesion->fetch_assoc();
    $stmtSesion->close();

    if ($numPlazas > (int) $sesion["plazas_disponibles"]) {
        throw new Exception("No hay plazas suficientes disponibles.");
    }

    $precioUnitario = (float) $sesion["precio"];
    $subtotal = $precioUnitario * $numPlazas;
    $iva = $subtotal * 0.21;
    $total = $subtotal + $iva;

    $sqlReserva = "
        INSERT INTO reservas (id_usuario, id_sesion, num_plazas, precio_unitario, importe_total, estado)
        VALUES (?, ?, ?, ?, ?, 'confirmada')
    ";

    $stmtReserva = $conexion->prepare($sqlReserva);
    if (!$stmtReserva) {
        throw new Exception("Error al preparar la inserción de la reserva.");
    }

    $stmtReserva->bind_param("iiidd", $idUsuario, $idSesion, $numPlazas, $precioUnitario, $total);
    $stmtReserva->execute();

    $idReserva = $stmtReserva->insert_id;
    $stmtReserva->close();

    $concepto = "Reserva de " . $sesion["nombre"] . " para " . $numPlazas . " plaza(s)";

    $sqlPresupuesto = "
        INSERT INTO presupuestos (id_reserva, concepto, subtotal, iva, total)
        VALUES (?, ?, ?, ?, ?)
    ";

    $stmtPresupuesto = $conexion->prepare($sqlPresupuesto);
    if (!$stmtPresupuesto) {
        throw new Exception("Error al preparar la inserción del presupuesto.");
    }

    $stmtPresupuesto->bind_param("isddd", $idReserva, $concepto, $subtotal, $iva, $total);
    $stmtPresupuesto->execute();
    $stmtPresupuesto->close();

    $sqlActualizar = "
        UPDATE sesiones_recurso
        SET plazas_disponibles = plazas_disponibles - ?
        WHERE id_sesion = ?
    ";

    $stmtActualizar = $conexion->prepare($sqlActualizar);
    if (!$stmtActualizar) {
        throw new Exception("Error al actualizar las plazas disponibles.");
    }

    $stmtActualizar->bind_param("ii", $numPlazas, $idSesion);
    $stmtActualizar->execute();
    $stmtActualizar->close();

    $conexion->commit();

    $_SESSION["mensaje_exito"] =
        "Reserva confirmada correctamente. " .
        "Recurso: " . $sesion["nombre"] . ". " .
        "Plazas: " . $numPlazas . ". " .
        "Total: " . number_format($total, 2, ",", ".") . " €.";

} catch (Exception $e) {
    $conexion->rollback();
    $_SESSION["mensaje_error"] = $e->getMessage();
}

$bd->cerrarConexion();

header("Location: ../reservas.php");
exit();
?>