"use strict"
class Cronometro {

    #tiempo
    #inicio
    #intervalo

    constructor() {
        this.#tiempo = 0
        this.#intervalo = null
    }

    arrancar() {
        if (this.#intervalo) return

        try {
            const ahora = Temporal.Now.instant()
            this.#inicio = (this.#tiempo > 0)
                ? ahora.subtract({ milliseconds: this.#tiempo })
                : ahora

        } catch (e) {
            const ahora = new Date()
            this.#inicio = new Date(ahora.getTime() - this.#tiempo)
        }

        this.#intervalo = setInterval(() => this.#actualizar(), 100)
    }

    #actualizar() {
        let ahora

        try {
            ahora = Temporal.Now.instant()
        } catch {
            ahora = new Date()
        }

        if (this.#inicio instanceof Date) {
            this.#tiempo = ahora - this.#inicio
        } else {
            const dur = this.#inicio.until(ahora)
            this.#tiempo = dur.total({ unit: "milliseconds" })
        }

        this.#mostrar()
    }

    #mostrar() {
        const total = this.#tiempo

        const min = String(Math.floor(total / 60000)).padStart(2, "0")
        const seg = String(Math.floor((total % 60000) / 1000)).padStart(2, "0")
        const dec = String(Math.floor((total % 1000) / 100))

        const txt = `${min}:${seg}.${dec}`

        const p = document.querySelector("main p")
        if (p) p.textContent = txt
    }

    parar() {
        if (this.#intervalo) {
            clearInterval(this.#intervalo)
            this.#intervalo = null
        }
    }

    reiniciar() {
        this.parar()
        this.#tiempo = 0
        this.#mostrar()
    }

    get tiempo() {
        return this.#tiempo
    }

}

const cronometro = new Cronometro()

window.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll("main button")

    botones[0].addEventListener("click", () => cronometro.arrancar())
    botones[1].addEventListener("click", () => cronometro.parar())
    botones[2].addEventListener("click", () => cronometro.reiniciar())
})
