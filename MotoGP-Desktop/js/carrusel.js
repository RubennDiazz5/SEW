"use strict"
class Carrusel {

    #busqueda
    #actual
    #maximo

    constructor() {
        this.#busqueda = "Autódromo Internacional do Algarve"
        this.#actual = 0
        this.#maximo = 4
        this.intervaloIniciado = false
    }

    getFotografias() {
        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.ajax({
            url: flickrAPI,
            dataType: "jsonp",
            data: {
                tags: this.#busqueda,
                tagmode: "any",
                format: "json"
            },
            success: (data) => {
                this.datos = data
                this.#procesarJSONFotografias()
            },
            error: function() {
                let error = $("<p>").text("ERROR")
                $("body").append(error)
            }
        })
    }

    #procesarJSONFotografias() {
        this.fotos = []

        $.each(this.datos.items, (i, item) => {
            if (i > this.#maximo) return false

            this.fotos.push(
                {
                    src: item.media.m.replace("_m.jpg", "_z.jpg"),
                    titulo: item.title
                }
            )
        })

        this.#mostrarFotografias()
    }

    #mostrarFotografias() {
        let article = $("main article")
        article.find("img").remove()
        let imagen = $("<img />")
            .attr("src", this.fotos[this.#actual].src)
            .attr("alt", "Carrusel de fotos de MotoGP")

        article.append(imagen)

        $("main").append(article)

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
