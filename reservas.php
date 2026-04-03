<?php
session_start();
require_once("php/conexion.php");

$bd = new ConexionBD();
$conexion = $bd->getConexion();

$sqlRecursos = "
    SELECT 
        r.id_recurso,
        r.nombre,
        r.descripcion,
        r.ubicacion,
        r.precio,
        r.plazas_totales,
        t.nombre_tipo,
        s.id_sesion,
        s.fecha_inicio,
        s.fecha_fin,
        s.plazas_disponibles
    FROM recursos_turisticos r
    INNER JOIN tipos_recurso t ON r.id_tipo = t.id_tipo
    INNER JOIN sesiones_recurso s ON r.id_recurso = s.id_recurso
    WHERE r.activo = 1
    ORDER BY s.fecha_inicio ASC
";

$resultadoRecursos = $conexion->query($sqlRecursos);

$resultadoReservas = null;
$stmtReservas = null;

if (isset($_SESSION["id_usuario"])) {
    $idUsuario = $_SESSION["id_usuario"];

    $sqlReservas = "
        SELECT 
            re.id_reserva,
            rt.nombre AS recurso,
            tr.nombre_tipo,
            sr.fecha_inicio,
            sr.fecha_fin,
            re.num_plazas,
            re.importe_total,
            re.estado
        FROM reservas re
        INNER JOIN sesiones_recurso sr ON re.id_sesion = sr.id_sesion
        INNER JOIN recursos_turisticos rt ON sr.id_recurso = rt.id_recurso
        INNER JOIN tipos_recurso tr ON rt.id_tipo = tr.id_tipo
        WHERE re.id_usuario = ?
        ORDER BY re.fecha_reserva DESC
    ";

    $stmtReservas = $conexion->prepare($sqlReservas);

    if ($stmtReservas) {
        $stmtReservas->bind_param("i", $idUsuario);
        $stmtReservas->execute();
        $resultadoReservas = $stmtReservas->get_result();
    }
}
?>
<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Reservas - Asturias Desktop</title>
    <meta name="description" content="Documento con la informacion de reservas del proyecto Asturias-Desktop" />
    <meta name="keywords" content="reservas turismo asturias, reservar actividades asturias, reservas online asturias, recursos turisticos asturias, reservar rutas asturias, reservar museos asturias, reservas hoteles asturias, turismo oviedo gijon llanes, gestion reservas asturias, sistema reservas turismo">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
</head>

<body>
    <header>
        <h1><a href="index.html" title="Inicio de la página web">Asturias Desktop</a></h1>

        <nav>
            <a href="index.html" title="Inicio de la página web">Inicio</a>
            <a href="gastronomia.html" title="Gastronomia de la provincia">Gastronomia</a>
            <a href="rutas.html" title="Rutas de la provincia">Rutas</a>
            <a href="meteorologia.html" title="Meteorología de la provincia">Meteorología</a>
            <a href="juego.html" title="Juego de la pagina web">Juego</a>
            <a href="reservas.php" title="Reservas de la provincia" class="active">Reservas</a>
            <a href="ayuda.html" title="Ayuda">Ayuda</a>
        </nav>
    </header>

    <p>Estás en: <a href="index.html" title="Inicio de la página web">Inicio</a> | Reservas</p>

    <main>
        <?php if (isset($_SESSION["mensaje_exito"]) || isset($_SESSION["mensaje_error"])) { ?>
        <section>
            <h2>Mensajes del sistema</h2>

            <?php if (isset($_SESSION["mensaje_exito"])) { ?>
                <p>
                    <?php
                        echo htmlspecialchars($_SESSION["mensaje_exito"]);
                        unset($_SESSION["mensaje_exito"]);
                    ?>
                </p>
            <?php } ?>

            <?php if (isset($_SESSION["mensaje_error"])) { ?>
                <p>
                    <?php
                        echo htmlspecialchars($_SESSION["mensaje_error"]);
                        unset($_SESSION["mensaje_error"]);
                    ?>
                </p>
            <?php } ?>

        </section>
        <?php } ?>

        <section>
            <h2>Central de reservas turísticas</h2>
            <p>Consulte los recursos turísticos disponibles y gestione sus reservas.</p>
        </section>

        <?php if (!isset($_SESSION["id_usuario"])) { ?>
            <section>
                <h2>Inicio de sesión</h2>
                <p>Si ya tiene cuenta, puede acceder desde aquí.</p>

                <form action="php/login_usuario.php" method="post">
                    <p>
                        <label for="email_login">Correo electrónico:</label>
                        <input type="email" id="email_login" name="email" required />
                    </p>

                    <p>
                        <label for="contrasena_login">Contraseña:</label>
                        <input type="password" id="contrasena_login" name="contrasena" required />
                    </p>

                    <p>
                        <input type="submit" value="Iniciar sesión" />
                    </p>
                </form>
            </section>

            <section>
                <h2>Registro de usuarios</h2>
                <p>Si no tiene cuenta, puede registrarse para poder realizar una reserva.</p>

                <form action="php/registro_usuario.php" method="post">
                    <p>
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" required />
                    </p>

                    <p>
                        <label for="apellidos">Apellidos:</label>
                        <input type="text" id="apellidos" name="apellidos" required />
                    </p>

                    <p>
                        <label for="email">Correo electrónico:</label>
                        <input type="email" id="email" name="email" required />
                    </p>

                    <p>
                        <label for="telefono">Teléfono:</label>
                        <input type="tel" id="telefono" name="telefono" />
                    </p>

                    <p>
                        <label for="contrasena">Contraseña:</label>
                        <input type="password" id="contrasena" name="contrasena" required />
                    </p>

                    <p>
                        <input type="submit" value="Registrarse" />
                    </p>
                </form>
            </section>
        <?php } else { ?>
            <section>
                <h2>Área de usuario</h2>
                <p>Bienvenido, <?php echo htmlspecialchars($_SESSION["nombre"]); ?>.</p>
                <p><a href="php/logout.php" title="Cerrar sesión">Cerrar sesión</a></p>
            </section>
        <?php } ?>

        <section>
            <h2>Recursos turísticos disponibles</h2>

            <?php
            if ($resultadoRecursos && $resultadoRecursos->num_rows > 0) {
                while ($fila = $resultadoRecursos->fetch_assoc()) {
                    ?>
                    <article>
                        <h3><?php echo htmlspecialchars($fila["nombre"]); ?></h3>
                        <p>Tipo: <?php echo htmlspecialchars($fila["nombre_tipo"]); ?></p>
                        <p>Descripción: <?php echo htmlspecialchars($fila["descripcion"]); ?></p>
                        <p>Ubicación: <?php echo htmlspecialchars($fila["ubicacion"]); ?></p>
                        <p>Precio: <?php echo htmlspecialchars($fila["precio"]); ?> €</p>
                        <p>Plazas totales: <?php echo htmlspecialchars($fila["plazas_totales"]); ?></p>
                        <p>Inicio: <?php echo htmlspecialchars($fila["fecha_inicio"]); ?></p>
                        <p>Fin: <?php echo htmlspecialchars($fila["fecha_fin"]); ?></p>
                        <p>Plazas disponibles: <?php echo htmlspecialchars($fila["plazas_disponibles"]); ?></p>
                    </article>
                    <?php
                }
            } else {
                echo "<p>No hay recursos turísticos disponibles en este momento.</p>";
            }
            ?>
        </section>

        <?php if (isset($_SESSION["id_usuario"])) { ?>
            <section>
                <h2>Realizar una reserva</h2>
                <form action="php/realizar_reserva.php" method="post">
                    <p>
                        <label for="id_sesion">Seleccione una sesión:</label>
                        <select id="id_sesion" name="id_sesion" required>
                            <option value="">-- Seleccione una opción --</option>
                            <?php
                            $resultadoSelect = $conexion->query($sqlRecursos);
                            if ($resultadoSelect) {
                                while ($fila = $resultadoSelect->fetch_assoc()) {
                                    if ((int) $fila["plazas_disponibles"] > 0) {
                                        ?>
                                        <option value="<?php echo htmlspecialchars($fila["id_sesion"]); ?>">
                                            <?php
                                            echo htmlspecialchars(
                                                $fila["nombre"] . " - " .
                                                $fila["fecha_inicio"] . " - " .
                                                $fila["precio"] . " € - plazas disponibles: " .
                                                $fila["plazas_disponibles"]
                                            );
                                            ?>
                                        </option>
                                        <?php
                                    }
                                }
                            }
                            ?>
                        </select>
                    </p>

                    <p>
                        <label for="num_plazas">Número de plazas:</label>
                        <input type="number" id="num_plazas" name="num_plazas" min="1" required />
                    </p>

                    <p>
                        <input type="submit" value="Generar presupuesto y confirmar reserva" />
                    </p>
                </form>
            </section>

            <section>
                <h2>Mis reservas</h2>

                <?php if ($resultadoReservas && $resultadoReservas->num_rows > 0) { ?>
                    <table>
                        <tr>
                            <th scope="col" id="recurso">Recurso</th>
                            <th scope="col" id="tipo">Tipo</th>
                            <th scope="col" id="inicio">Inicio</th>
                            <th scope="col" id="fin">Fin</th>
                            <th scope="col" id="plazas">Plazas</th>
                            <th scope="col" id="importe">Importe total</th>
                            <th scope="col" id="estado">Estado</th>
                            <th scope="col" id="accion">Acción</th>
                        </tr>

                        <?php while ($filaReserva = $resultadoReservas->fetch_assoc()) { ?>
                            <tr>
                                <td headers="recurso"><?php echo htmlspecialchars($filaReserva["recurso"]); ?></td>
                                <td headers="tipo"><?php echo htmlspecialchars($filaReserva["nombre_tipo"]); ?></td>
                                <td headers="inicio"><?php echo htmlspecialchars($filaReserva["fecha_inicio"]); ?></td>
                                <td headers="fin"><?php echo htmlspecialchars($filaReserva["fecha_fin"]); ?></td>
                                <td headers="plazas"><?php echo htmlspecialchars($filaReserva["num_plazas"]); ?></td>
                                <td headers="importe"><?php echo htmlspecialchars($filaReserva["importe_total"]); ?> €</td>
                                <td headers="estado"><?php echo htmlspecialchars($filaReserva["estado"]); ?></td>
                                <td headers="accion">
                                    <?php if ($filaReserva["estado"] === "confirmada") { ?>
                                        <form action="php/anular_reserva.php" method="post">
                                            <p>
                                                <input
                                                    type="hidden"
                                                    name="id_reserva"
                                                    value="<?php echo htmlspecialchars($filaReserva["id_reserva"]); ?>"
                                                />
                                                <input type="submit" value="Anular" />
                                            </p>
                                        </form>
                                    <?php } else { ?>
                                        <p>Reserva anulada</p>
                                    <?php } ?>
                                </td>
                            </tr>
                        <?php } ?>
                    </table>
                <?php } else { ?>
                    <p>No tiene reservas registradas.</p>
                <?php } ?>
            </section>
        <?php } ?>
    </main>
</body>
</html>
<?php
if ($stmtReservas) {
    $stmtReservas->close();
}
$bd->cerrarConexion();
?>