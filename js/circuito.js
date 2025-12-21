"use strict"
class Circuito {

    constructor() {
        this.comprobarApiFile()
    }

    comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("API File soportada")
        } else {
            console.log("API File NO soportada")
        }
    }

    leerArchivoHTML() {
        let input = document.getElementById("archivoHTML")

        if (input.files.length === 0) return

        let archivo = input.files[0]
        let lector = new FileReader()

        lector.onload = (evento) => {
            let contenido = evento.target.result
            this.procesarHTML(contenido)
        }

        lector.onerror = () => {
            console.log("Error al leer el archivo HTML")
        }

        lector.readAsText(archivo)
    }

    procesarHTML(textoHTML) {
        let parser = new DOMParser()
        let domInfo = parser.parseFromString(textoHTML, "text/html")

        let inputHTML = document.getElementById("archivoHTML") 
        let parrafoInput = inputHTML.parentElement

        let section = document.createElement("section")

        let titulo = domInfo.querySelector("h1")
        if (titulo) {
            let h3 = document.createElement("h3")
            h3.textContent = titulo.textContent
            section.appendChild(h3)
        }

        let secciones = domInfo.querySelectorAll("section")

        secciones.forEach(sec => {
            let nuevaSeccion = document.createElement("section")

            let h2 = sec.querySelector("h2")
            if (h2) {
                let tituloSeccion = document.createElement("h4")
                tituloSeccion.textContent = h2.textContent
                nuevaSeccion.appendChild(tituloSeccion)
            }

            sec.querySelectorAll("p").forEach(p => {
                let nuevoP = document.createElement("p")
                nuevoP.textContent = p.textContent
                nuevaSeccion.appendChild(nuevoP)
            })

            let items = sec.querySelectorAll("li")
            if (items.length > 0) {
                let ul = document.createElement("ul")

                items.forEach(li => {
                    let url = li.textContent.trim()
                    let ext = url.split('.').pop().toLowerCase()

                    if (['jpg','jpeg','png','gif'].includes(ext)) {
                        let img = document.createElement("img")
                        img.src = url
                        img.alt = "Imagen"
                        nuevaSeccion.appendChild(img)
                    } else if (['mp4','webm','ogg'].includes(ext)) {
                        let video = document.createElement("video")
                        video.src = url
                        video.controls = true
                        nuevaSeccion.appendChild(video)
                    } else {
                        let nuevoLi = document.createElement("li")
                        let enlace = li.querySelector("a")

                        if (enlace) {
                            let nuevoA = document.createElement("a")
                            nuevoA.href = enlace.href
                            nuevoA.textContent = enlace.textContent
                            nuevoA.target = "_blank"
                            nuevoLi.appendChild(nuevoA)
                        } else {
                            nuevoLi.textContent = li.textContent
                        }

                        ul.appendChild(nuevoLi)
                    }
                })

                if (ul.children.length > 0) {
                    nuevaSeccion.appendChild(ul)
                }
            }

            section.appendChild(nuevaSeccion)
        })

        parrafoInput.replaceWith(section)
    }

}

"use strict"
class CargadorSVG {

    constructor() {
        this.comprobarApiFile()
    }

    comprobarApiFile() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("API File soportada para SVG")
        } else {
            console.log("API File NO soportada")
        }
    }

    leerArchivoSVG() {
        let input = document.getElementById("archivoSVG")

        if (input.files.length === 0) return

        let archivo = input.files[0]
        let lector = new FileReader()

        lector.onload = (e) => {
            this.insertarSVG(e.target.result)
        }

        lector.onerror = () => {
            console.log("Error al leer el archivo SVG")
        }

        lector.readAsText(archivo)
    }

    insertarSVG(contenidoSVG) {
        let inputSVG = document.getElementById("archivoSVG")
        let parrafoInput = inputSVG.parentElement

        let contenedor = document.createElement("section")

        let titulo = document.createElement("h3")
        titulo.textContent = "Perfil de altimetría"
        contenedor.appendChild(titulo)

        let visor = document.createElement("section")
        visor.innerHTML = contenidoSVG
        contenedor.appendChild(visor)

        parrafoInput.replaceWith(contenedor)
    }
}

"use strict";
class CargadorKML {

    #puntoOrigen;
    #tramos;
    #mapa;

    constructor(mapa) {
        this.#mapa = mapa;
        this.#puntoOrigen = null;
        this.#tramos = [];
    }

    leerArchivoKML(event) {
        const archivo = event.target.files[0];
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = (e) => {
            this.#procesarKML(e.target.result);
            this.insertarCapaKML();
        };
        lector.readAsText(archivo);
    }

    #procesarKML(textoKML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(textoKML, "application/xml");

        const nodos = xml.getElementsByTagName("coordinates");
        this.#tramos = [];

        for (let nodo of nodos) {
            const puntos = nodo.textContent.trim().split(/\s+/);
            const tramo = puntos.map(p => {
                const [lon, lat] = p.split(",").map(Number);
                return { lat: lat, lng: lon };
            });
            this.#tramos.push(tramo);
        }

        if (this.#tramos.length > 0) {
            this.#puntoOrigen = this.#tramos[0][0];
        }
    }

    insertarCapaKML() {
        if (!this.#puntoOrigen) return;

        // Marcador del punto origen
        new google.maps.Marker({
            position: this.#puntoOrigen,
            map: this.#mapa,
            title: "Punto origen del circuito"
        });

        const limites = new google.maps.LatLngBounds();

        // Dibujar los tramos
        for (let tramo of this.#tramos) {
            const polilinea = new google.maps.Polyline({
                path: tramo,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 3,
                map: this.#mapa
            });

            tramo.forEach(p => limites.extend(p));
        }

        // Ajustar el mapa al circuito
        this.#mapa.fitBounds(limites);
    }
}


let mapa;
const circuito = new Circuito()
const cargadorSVG = new CargadorSVG()

function initMap() {
    mapa = new google.maps.Map(document.getElementById("mapaCircuito"), {
        center: { lat: 40.4168, lng: -3.7038 }, // centro provisional
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    const cargadorKML = new CargadorKML(mapa);
    const inputKML = document.getElementById("archivoKML")
    inputKML.addEventListener("change", (event) => cargadorKML.leerArchivoKML(event));
}

window.addEventListener("DOMContentLoaded", () => {
    const inputHTML = document.getElementById("archivoHTML")
    const inputSVG = document.getElementById("archivoSVG")
    
    inputHTML.addEventListener("change", () => circuito.leerArchivoHTML())
    inputSVG.addEventListener("change", () => cargadorSVG.leerArchivoSVG())
})