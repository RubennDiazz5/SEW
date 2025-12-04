"use strict"
class Memoria {

    #tableroBloqueado
    #primera
    #segunda
    #cronometro

    constructor() {
        this.#tableroBloqueado = true
        this.#primera = null
        this.#segunda = null

        this.#barajarCartas()

        this.#tableroBloqueado = false

        this.#cronometro = new Cronometro()
        this.#cronometro.arrancar()
    }

    voltearCarta(carta) {
        if (this.#tableroBloqueado ||
            carta.dataset.estado === "revelada" ||
            carta.dataset.estado === "volteada") return

        carta.dataset.estado = "volteada"

        if (!this.#primera) {
            this.#primera = carta

            if (this.#cronometro.tiempo === 0)
                this.#cronometro.arrancar()

            return
        }

        this.#segunda = carta
        this.#comprobarPareja()
    }

    #barajarCartas() {
        const cont = document.querySelector("main")
        const cartas = [...cont.children].filter(x => x.tagName === "ARTICLE")

        for (let i = cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            [cartas[i], cartas[j]] = [cartas[j], cartas[i]]
        }

        cartas.forEach(c => cont.appendChild(c))
    }

    #reiniciarJugada() {
        this.#tableroBloqueado = false
        this.#primera = null
        this.#segunda = null
    }

    #deshabilitarCartas() {
        this.#primera.dataset.estado = "revelada"
        this.#segunda.dataset.estado = "revelada"

        this.#comprobarFin()
        this.#reiniciarJugada()
    }

    #comprobarFin() {
        const cartas = document.querySelectorAll("main article")
        const terminado = [...cartas].every(c => c.dataset.estado === "revelada")

        if (terminado) {
            alert("¡Has completado el juego!")
            this.#cronometro.parar()
        }
    }

    #cubrirCartas() {
        this.#tableroBloqueado = true

        setTimeout(() => {
            this.#primera.removeAttribute("data-estado")
            this.#segunda.removeAttribute("data-estado")

            this.#reiniciarJugada()
        }, 1500)
    }

    #comprobarPareja() {
        const img1 = this.#primera.children[1].src
        const img2 = this.#segunda.children[1].src

        (img1 === img2)
            ? this.#deshabilitarCartas()
            : this.#cubrirCartas()
    }

}

const juegoMemoria = new Memoria()

window.addEventListener("DOMContentLoaded", () => {
    const cartas = document.querySelectorAll("main article")

    for (const carta of cartas) {
        carta.addEventListener("click", (event) => {
            juegoMemoria.voltearCarta(event.currentTarget)
        })
    }
})
