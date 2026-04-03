"use strict"

class Ciudad {

    #nombre
    #pais
    #gentilicio
    #poblacion
    #coordenadas

    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre
        this.#pais = pais
        this.#gentilicio = gentilicio
    }

    rellenarDatos(poblacion, coordenadas) {
        this.#poblacion = poblacion
        this.#coordenadas = coordenadas
    }

    getCiudad() {
        return this.#nombre
    }

    getPais() {
        return this.#pais
    }

    getInfoSecundariaDOM() {
        const ul = document.createElement("ul")

        const liGent = document.createElement("li")
        liGent.textContent = `Gentilicio: ${this.#gentilicio}`
        ul.appendChild(liGent)

        const liPob = document.createElement("li")
        liPob.textContent = `Población: ${this.#poblacion}`
        ul.appendChild(liPob)

        return ul
    }

    showCoordenadas() {
        const root = document.querySelector("main section")

        const ul = document.createElement("ul")

        const liLat = document.createElement("li")
        liLat.textContent = `Latitud: ${this.#coordenadas.lat}`

        const liLon = document.createElement("li")
        liLon.textContent = `Longitud: ${this.#coordenadas.lon}`

        ul.appendChild(liLat)
        ul.appendChild(liLon)

        root.appendChild(ul)
    }

    getMeteorologiaActual() {
        const lat = this.#coordenadas.lat
        const lon = this.#coordenadas.lon

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`

        $.ajax({

            url: url,
            dataType: "json",
            method: "GET",

            success: (data) => {
                this.datosActual = data
                this.#procesarMeteorologiaActual()
            },

            error: () => {
                $("main").append($("<p>").text("Error obteniendo meteorología actual"))
            }
        })
    }

    #procesarMeteorologiaActual() {
        const weather = this.datosActual.current_weather

        let section = $("<section>")

        let title = $("<h2>").text("Meteorología actual en Oviedo")

        let ul = $("<ul>")

        ul.append($("<li>").text(`Temperatura: ${weather.temperature} °C`))
        ul.append($("<li>").text(`Velocidad viento: ${weather.windspeed} km/h`))
        ul.append($("<li>").text(`Dirección viento: ${weather.winddirection}°`))
        ul.append($("<li>").text(`Hora: ${weather.time}`))

        section.append(title)
        section.append(ul)

        $("main").append(section)
    }

    getPrevision7Dias() {
        const lat = this.#coordenadas.lat
        const lon = this.#coordenadas.lon

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`

        $.ajax({

            url: url,
            dataType: "json",
            method: "GET",

            success: (data) => {
                this.datosPrevision = data
                this.#procesarPrevision()
            },

            error: () => {
                $("main").append($("<p>").text("Error obteniendo previsión"))
            }
        })
    }

    #procesarPrevision() {
        const daily = this.datosPrevision.daily

        let section = $("<section>")
        let title = $("<h2>").text("Previsión meteorológica (7 días)")
        let ul = $("<ul>")

        for (let i = 0; i < daily.time.length; i++) {

            const li = $("<li>").text(
                `${daily.time[i]} → 
                Temp max: ${daily.temperature_2m_max[i]}°C, 
                Temp min: ${daily.temperature_2m_min[i]}°C, 
                Lluvia: ${daily.precipitation_sum[i]} mm`
            )

            ul.append(li)
        }

        section.append(title)
        section.append(ul)

        $("main").append(section)
    }

}


// OVIEDO (capital de Asturias)
let oviedo = new Ciudad("Oviedo", "España", "Ovetense")

oviedo.rellenarDatos(
    220000,
    {
        lat: 43.3614,
        lon: -5.8593
    }
)


// CONTENIDO INICIAL
const main = document.querySelector("main")

let section = document.createElement("section")
let title = document.createElement("h2")

title.textContent = "Meteorología de Asturias"
section.appendChild(title)

let pCiudad = document.createElement("p")
pCiudad.textContent = "Ciudad: " + oviedo.getCiudad()

let pPais = document.createElement("p")
pPais.textContent = "País: " + oviedo.getPais()

section.appendChild(pCiudad)
section.appendChild(pPais)

section.appendChild(oviedo.getInfoSecundariaDOM())

main.appendChild(section)

oviedo.showCoordenadas()


// LLAMADAS A SERVICIOS WEB
oviedo.getMeteorologiaActual()
oviedo.getPrevision7Dias()