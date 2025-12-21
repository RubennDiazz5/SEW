<?php
class Cronometro {

    private $tiempo;
    private $inicio;

    public function __construct() {
        $this->tiempo = 0;
    }

    public function arrancar() {
        $this->inicio = microtime(true);
    }

    public function parar() {
        $fin = microtime(true);
        $this->tiempo = $fin - $this->inicio;
    }

    public function mostrar() {
        $minutos = floor($this->tiempo / 60);
        $segundos = $this->tiempo - ($minutos * 60);

        return sprintf("%02d:%04.1f", $minutos, $segundos);
    }

    public function getTiempo() {
        return $this->tiempo;
    }

}
?>