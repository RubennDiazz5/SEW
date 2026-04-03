"use strict"
class Carrusel {
    #actual
    #maximo

    constructor() {
        this.#actual = 0

        this.fotos = [
            {src: "multimedia/carrusel/mapa.jpg", titulo: "Mapa de Asturias"},
            {src: "multimedia/carrusel/foto1.jpg", titulo: "Recurso turístico 1"},
            {src: "multimedia/carrusel/foto2.jpg", titulo: "Recurso turístico 2"},
            {src: "multimedia/carrusel/foto3.jpg", titulo: "Recurso turístico 3"},
            {src: "multimedia/carrusel/foto4.jpg", titulo: "Recurso turístico 4"}
        ]

        this.#maximo = this.fotos.length - 1

        this.articleCarrusel = null
        this.intervaloIniciado = false
    }

    getFotografias() {
        this.#mostrarFotografias()
    }

    #mostrarFotografias() {
        let main = $("main")

        if (!this.articleCarrusel) {
            this.articleCarrusel = $("<article>")
                .append($("<h2>").text("Carrusel de imágenes de Asturias"))
                .append($("<img />"))
                .appendTo(main)
        }

        this.articleCarrusel.find("img")
            .attr("src", this.fotos[this.#actual].src)
            .attr("alt", this.fotos[this.#actual].titulo)

        if (!this.intervaloIniciado) {
            setInterval(this.#cambiarFotografia.bind(this), 3000)
            this.intervaloIniciado = true
        }
    }

    #cambiarFotografia() {
        this.#actual++

        if (this.#actual > this.#maximo) {
            this.#actual = 0
        }

        this.#mostrarFotografias()
    }
}

let carrusel = new Carrusel()
carrusel.getFotografias()