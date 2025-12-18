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
        const root = document.querySelector("main section")
        const ul = document.createElement("ul")

        const liGent = document.createElement("li")
        liGent.textContent = `Gentilicio: ${this.#gentilicio}`
        ul.appendChild(liGent)

        const liPob = document.createElement("li")
        liPob.textContent = `Población: ${this.#poblacion}`
        ul.appendChild(liPob)

        root.appendChild(ul)

        return ul
    }

    showCoordenadas() {
        const root = document.querySelector("main section")
        const p = document.createElement("p")

        if (!this.#coordenadas) {
            p.textContent = "Coordenadas no definidas."
            root.appendChild(p)
            return
        }

        p.textContent = "Coordenadas:"
        root.appendChild(p)

        const ul = document.createElement("ul")

        const liLat = document.createElement("li")
        liLat.textContent = `Latitud: ${this.#coordenadas.lat}`
        ul.appendChild(liLat)

        const liLon = document.createElement("li")
        liLon.textContent = `Longitud: ${this.#coordenadas.lon}`
        ul.appendChild(liLon)

        root.appendChild(ul)
    }

    getMeteorologiaCarrera() {
        const lat = this.#coordenadas.lat
        const lon = this.#coordenadas.lon
        const fecha = "2025-11-09"

        const url = `https://archive-api.open-meteo.com/v1/archive?` +
                `latitude=${lat}&longitude=${lon}&` +
                `start_date=${fecha}&end_date=${fecha}&` +
                `hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m&` +
                `daily=sunrise,sunset&timezone=auto`

        $.ajax({
            url: url,
            dataType: "json",
            method: 'GET',
            success: (data) => {
                this.datos = data
                this.#procesarJSONCarrera()
            },
            error: function() {
                let error = $("<p>").text("ERROR CARRERA")
                $("body").append(error)
            }
        })
    }

    #procesarJSONCarrera() {
        const hourly = this.datos.hourly
        const daily = this.datos.daily

        const time = hourly.time
        const temperature_2m = hourly.temperature_2m
        const apparent_temperature = hourly.apparent_temperature
        const relative_humidity_2m = hourly.relative_humidity_2m
        const precipitation = hourly.precipitation
        const wind_speed_10m = hourly.wind_speed_10m
        const wind_direction_10m = hourly.wind_direction_10m
        const sunrise = daily.sunrise[0]
        const sunset = daily.sunset[0]

        let section = $("main section")
        let title = $("<p>").text("Meteorologia carrera:")
        let ul = $("<ul>")

        for (let i = 0; i < time.length; i++) {
            const li = $("<li>").text(
                `${time[i]} -> 
                Temp: ${temperature_2m[i]}°C, 
                Sensación: ${apparent_temperature[i]}°C, 
                Humedad: ${relative_humidity_2m[i]}%, 
                Lluvia: ${precipitation[i]} mm, 
                Viento: ${wind_speed_10m[i]} m/s, 
                Dir: ${wind_direction_10m[i]}°`
            )

            ul.append(li)
        }

        const pSun = $("<li>").text(`Salida del sol: ${sunrise}, Puesta del sol: ${sunset}`)

        section.append(title)
        ul.append(pSun)
        section.append(ul)
    }

    getMeteorologiaEntrenos() {
        const lat = this.#coordenadas.lat
        const lon = this.#coordenadas.lon
        const fechaInit = "2025-11-06"
        const fechaFIN = "2025-11-08"

        const url = `https://archive-api.open-meteo.com/v1/archive?` +
                `latitude=${lat}&longitude=${lon}&` +
                `start_date=${fechaInit}&end_date=${fechaFIN}&` +
                `hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,`

        $.ajax({
            url: url,
            dataType: "json",
            method: 'GET',
            success: (data) => {
                this.datos = data
                this.#procesarJSONEntrenos()
            },
            error: function() {
                let error = $("<p>").text("ERROR ENTRENOS")
                $("body").append(error)
            }
        })
    }

    #procesarJSONEntrenos() {
        const hourly = this.datos.hourly

        const time = hourly.time  // Array de timestamps
        const temperature_2m = hourly.temperature_2m
        const relative_humidity_2m = hourly.relative_humidity_2m
        const precipitation = hourly.precipitation
        const wind_speed_10m = hourly.wind_speed_10m

        const dias = [...new Set(time.map(t => t.split('T')[0]))]

        const mediasPorDia = []

        dias.forEach(dia => {
            const indices = time.reduce((arr, t, i) => {
                if (t.startsWith(dia)) arr.push(i)
                return arr
            }, [])

            const mediaTemp = indices.reduce((sum, i) => sum + temperature_2m[i], 0) / indices.length
            const mediaHumedad = indices.reduce((sum, i) => sum + relative_humidity_2m[i], 0) / indices.length
            const mediaLluvia = indices.reduce((sum, i) => sum + precipitation[i], 0) / indices.length
            const mediaViento = indices.reduce((sum, i) => sum + wind_speed_10m[i], 0) / indices.length

            mediasPorDia.push({
                dia,
                temperatura: mediaTemp.toFixed(2),
                humedad: mediaHumedad.toFixed(2),
                lluvia: mediaLluvia.toFixed(2),
                viento: mediaViento.toFixed(2)
            })
        })

        let section = $("main section")

        let title = $("<p>").text("Meteorología entrenos:")
        let ul = $("<ul>")

        mediasPorDia.forEach(dia => {
            const li = $("<li>").text(
                `${dia.dia} → ` +
                `Temp media: ${dia.temperatura}°C, ` +
                `Humedad: ${dia.humedad}%, ` +
                `Lluvia: ${dia.lluvia} mm, ` +
                `Viento: ${dia.viento} m/s`
            )
            ul.append(li)
        })

        section.append(title)
        section.append(ul)
    }
    
}


let portimao = new Ciudad("Portimao", "Portugal", "Portimonense")

portimao.rellenarDatos(
    55000, 
    {
        lat: 37.1361,
        lon: -8.5342
    }
)

// Contenedor raíz
const root = document.querySelector("main section")

// --- Ciudad ---
let pCiudad = document.createElement("p")
pCiudad.textContent = "Ciudad: " + portimao.getCiudad()
root.appendChild(pCiudad)

// --- País ---
let pPais = document.createElement("p")
pPais.textContent = "País: " + portimao.getPais()
root.appendChild(pPais)

// --- Información ---
let pInfo = document.createElement("p")
pInfo.textContent = "Información:"
root.appendChild(pInfo)

// Inserción del <ul> generado por el método
root.appendChild(portimao.getInfoSecundariaDOM())

// --- Coordenadas ---
portimao.showCoordenadas()

// --- Meteorologia ---
portimao.getMeteorologiaCarrera()
portimao.getMeteorologiaEntrenos()
