"use strict"
class Noticias {

    #busqueda
    #url
    #apiKey
    
    constructor() {
        this.#busqueda = "MotoGP"
        this.#url = "https://api.thenewsapi.com/v1/news/all?"
        this.#apiKey = "4diTXkuqNuZzn4TA75KHMwolwiK8A0RTAxHm40Kj"
    }

    async buscar() {
        const params = {
            api_token: this.#apiKey,
            search: this.#busqueda,
            language: 'es',
            limit: 50
        }

        const esc = encodeURIComponent;
        const query = Object.keys(params)
            .map(k => `${esc(k)}=${esc(params[k])}`)
            .join('&');

        const urlCompleta = this.#url + query

        try {
            const response = await fetch(urlCompleta, { method: 'GET' })

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error("Error al obtener noticias:", error)
            throw error
        }
    }

    procesarInformacion(json) {
        if (!json || !json.data || json.data.length === 0) {
            console.warn("No se encontraron noticias")
            return []
        }

        const noticiasProcesadas = json.data.map(noticia => {
            return {
                titulo: noticia.title || "Sin título",
                descripcion: noticia.description || "Sin descripción",
                url: noticia.url || "#",
                fuente: noticia.source || "Desconocida",
                fecha: noticia.published_at || "Desconocida"
            }
        })

        return noticiasProcesadas
    }

}

const noticias = new Noticias();

noticias.buscar()
    .then(data => {
        const noticiasProcesadas = noticias.procesarInformacion(data)
        let root = $("main")
        let article = $("<article>")
        let title = $("<h2>").text("Noticias MotoGP")
        let ul = $("<ul>")

        noticiasProcesadas.forEach(noticia => {
            const li = $("<li>")
            const h3 = $("<h3>").text(noticia.titulo)
            const pDesc = $("<p>").text(noticia.descripcion)

            const pMeta = $("<p>").text(
                `Fuente: ${noticia.fuente} | Fecha: ${noticia.fecha}`
            )

            const link = $("<a>")
                .attr("href", noticia.url)
                .attr("target", "_blank")
                .text("Leer noticia completa")

            li.append(h3)
            li.append(pDesc)
            li.append(pMeta)
            li.append(link)

            ul.append(li)
        })

        article.append(title)
        article.append(ul)
        root.append(article)
    })
    .catch(error => {
        console.error("Error al obtener noticias:", error)
    });
