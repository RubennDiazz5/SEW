"use strict";

class Hito {
    #nombre;
    #descripcion;
    #coordenadas;
    #distancia;
    #fotos;

    constructor(nombre, descripcion, coordenadas, distancia, fotos) {
        this.#nombre = nombre;
        this.#descripcion = descripcion;
        this.#coordenadas = coordenadas;
        this.#distancia = distancia;
        this.#fotos = fotos;
    }

    get nombre() {
        return this.#nombre;
    }

    get descripcion() {
        return this.#descripcion;
    }

    get coordenadas() {
        return this.#coordenadas;
    }

    get distancia() {
        return this.#distancia;
    }

    get fotos() {
        return this.#fotos;
    }

    crearDOM() {
        const $hito = $("<section>");

        $hito.append($("<h4>").text(`${this.#nombre} (${this.#distancia} km)`));
        $hito.append($("<p>").text(this.#descripcion));
        $hito.append(
            $("<p>").text(
                `Coordenadas: lat ${this.#coordenadas.lat}, lon ${this.#coordenadas.lon}, alt ${this.#coordenadas.alt} m`
            )
        );

        if (this.#fotos.length > 0) {
            const $listaFotos = $("<ul>");

            this.#fotos.forEach((foto, indice) => {
                const $item = $("<li>");
                $item.append(
                    $("<img>")
                        .attr("src", foto)
                        .attr("alt", `${this.#nombre} - foto ${indice + 1}`)
                );
                $listaFotos.append($item);
            });

            $hito.append($listaFotos);
        }

        return $hito;
    }
}

class Ruta {
    #nombre;
    #tipo;
    #transporte;
    #fechaInicio;
    #horaInicio;
    #duracion;
    #agencia;
    #descripcion;
    #personasAdecuadas;
    #lugarInicio;
    #direccionInicio;
    #coordenadas;
    #referencias;
    #recomendacion;
    #hitos;
    #planimetria;
    #altimetria;

    constructor(xmlRuta) {
        const $ruta = $(xmlRuta);

        this.#nombre = $ruta.children("nombre").first().text().trim();
        this.#tipo = $ruta.children("tipo").first().text().trim();
        this.#transporte = $ruta.children("transporte").first().text().trim();
        this.#fechaInicio = $ruta.children("fechaInicio").first().text().trim();
        this.#horaInicio = $ruta.children("horaInicio").first().text().trim();
        this.#duracion = $ruta.children("duracion").first().text().trim();
        this.#agencia = $ruta.children("agencia").first().text().trim();
        this.#descripcion = $ruta.children("descripcion").first().text().trim();
        this.#personasAdecuadas = $ruta.children("personasAdecuadas").first().text().trim();
        this.#lugarInicio = $ruta.children("lugarInicio").first().text().trim();
        this.#direccionInicio = $ruta.children("direccionInicio").first().text().trim();

        const $coordRuta = $ruta.children("coordenadas").first();
        this.#coordenadas = {
            lat: parseFloat($coordRuta.children("latitud").text()),
            lon: parseFloat($coordRuta.children("longitud").text()),
            alt: parseFloat($coordRuta.children("altitud").text())
        };

        this.#referencias = [];
        $ruta.children("referencias").children("referencia").each((_, ref) => {
            this.#referencias.push($(ref).text().trim());
        });

        this.#recomendacion = $ruta.children("recomendacion").first().text().trim();

        this.#hitos = [];
        $ruta.children("hitos").children("hito").each((_, h) => {
            const $hito = $(h);
            const $coordHito = $hito.children("coordenadas").first();

            const nombre = $hito.children("nombre").first().text().trim();
            const descripcion = $hito.children("descripcion").first().text().trim();
            const coordenadas = {
                lat: parseFloat($coordHito.children("latitud").text()),
                lon: parseFloat($coordHito.children("longitud").text()),
                alt: parseFloat($coordHito.children("altitud").text())
            };
            const distancia = parseFloat($hito.children("distancia").first().text());

            const fotos = [];
            $hito.children("galeriaFotos").children("foto").each((_, f) => {
                fotos.push($(f).text().trim());
            });

            this.#hitos.push(new Hito(nombre, descripcion, coordenadas, distancia, fotos));
        });

        this.#planimetria = "xml/" + $ruta.children("planimetria").first().text().trim();
        this.#altimetria = "xml/" + $ruta.children("altimetria").first().text().trim();
    }

    crearDOM() {
        const $ruta = $("<article>");

        $ruta.append($("<h3>").text(this.#nombre));
        $ruta.append($("<p>").text(`Tipo: ${this.#tipo}`));
        $ruta.append($("<p>").text(`Transporte: ${this.#transporte}`));

        if (this.#fechaInicio) {
            $ruta.append($("<p>").text(`Fecha de inicio: ${this.#fechaInicio}`));
        }

        if (this.#horaInicio) {
            $ruta.append($("<p>").text(`Hora de inicio: ${this.#horaInicio}`));
        }

        $ruta.append($("<p>").text(`Duración: ${this.#duracion}`));
        $ruta.append($("<p>").text(`Agencia: ${this.#agencia}`));
        $ruta.append($("<p>").text(this.#descripcion));
        $ruta.append($("<p>").text(`Personas adecuadas: ${this.#personasAdecuadas}`));
        $ruta.append($("<p>").text(`Inicio: ${this.#lugarInicio}, ${this.#direccionInicio}`));
        $ruta.append(
            $("<p>").text(
                `Coordenadas iniciales: lat ${this.#coordenadas.lat}, lon ${this.#coordenadas.lon}, alt ${this.#coordenadas.alt} m`
            )
        );

        const $refs = $("<ul>");
        this.#referencias.forEach(ref => {
            $refs.append(
                $("<li>").append(
                    $("<a>")
                        .attr("href", ref)
                        .attr("target", "_blank")
                        .attr("rel", "noopener noreferrer")
                        .text(ref)
                )
            );
        });

        $ruta.append($("<h4>").text("Referencias"));
        $ruta.append($refs);
        $ruta.append($("<p>").text(`Recomendación: ${this.#recomendacion}/10`));

        const $hitosCont = $("<section>");
        $hitosCont.append($("<h4>").text("Hitos de la ruta"));
        this.#hitos.forEach(hito => $hitosCont.append(hito.crearDOM()));
        $ruta.append($hitosCont);

        $ruta.append($("<h4>").text("Planimetría"));

        const $contenedorMapa = $("<div>").css({
            width: "100%",
            height: "400px"
        });
        $ruta.append($contenedorMapa);

        $ruta.append($("<h4>").text("Altimetría"));
        const $contenedorAltimetria = $("<section>");
        $ruta.append($contenedorAltimetria);

        return {
            $elemento: $ruta,
            mapaEl: $contenedorMapa[0],
            altimetriaEl: $contenedorAltimetria[0]
        };
    }

    cargarPlanimetria(mapaEl) {
        if (!this.#planimetria || !mapaEl) {
            return;
        }

        const mapa = new google.maps.Map(mapaEl, {
            center: { lat: this.#coordenadas.lat, lng: this.#coordenadas.lon },
            zoom: 12
        });

        fetch(this.#planimetria)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`No se pudo cargar ${this.#planimetria}`);
                }
                return res.text();
            })
            .then(texto => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(texto, "application/xml");
                const coords = xml.getElementsByTagName("coordinates");

                const limites = new google.maps.LatLngBounds();
                let hayElementos = false;

                for (const nodo of coords) {
                    const contenido = nodo.textContent.trim();
                    if (!contenido) {
                        continue;
                    }

                    const puntos = contenido
                        .split(/\s+/)
                        .map(p => {
                            const [lon, lat] = p.split(",").map(Number);
                            return { lat: lat, lng: lon };
                        })
                        .filter(p => !Number.isNaN(p.lat) && !Number.isNaN(p.lng));

                    if (puntos.length > 1) {
                        hayElementos = true;

                        new google.maps.Polyline({
                            path: puntos,
                            strokeColor: "#FF0000",
                            strokeOpacity: 1,
                            strokeWeight: 3,
                            map: mapa
                        });

                        puntos.forEach(p => limites.extend(p));
                    }
                }

                this.#hitos.forEach(hito => {
                    const posicion = {
                        lat: hito.coordenadas.lat,
                        lng: hito.coordenadas.lon
                    };

                    const marcador = new google.maps.Marker({
                        position: posicion,
                        map: mapa,
                        title: hito.nombre
                    });

                    const ventana = new google.maps.InfoWindow({
                        content: `
                            <section>
                                <h5>${hito.nombre}</h5>
                                <p>${hito.descripcion}</p>
                                <p>Distancia: ${hito.distancia} km</p>
                            </section>
                        `
                    });

                    marcador.addListener("click", () => {
                        ventana.open({
                            anchor: marcador,
                            map
                        });
                    });

                    limites.extend(posicion);
                    hayElementos = true;
                });

                if (hayElementos) {
                    mapa.fitBounds(limites);
                }
            })
            .catch(err => console.error("Error al cargar la planimetría:", err));
    }

    #obtenerZonaUtilSVG(svgEl) {
        let candidatos = Array.from(svgEl.querySelectorAll("polyline, path"));

        candidatos = candidatos.filter(el => {
            try {
                const caja = el.getBBox();
                return caja && caja.width > 0 && caja.height > 0;
            } catch {
                return false;
            }
        });

        if (candidatos.length === 0) {
            return null;
        }

        let mejor = candidatos[0];
        let mejorCaja = mejor.getBBox();

        candidatos.forEach(el => {
            const caja = el.getBBox();
            if (caja.width > mejorCaja.width) {
                mejor = el;
                mejorCaja = caja;
            }
        });

        return {
            xInicio: mejorCaja.x,
            xFin: mejorCaja.x + mejorCaja.width
        };
    }

    cargarAltimetria(altimetriaEl) {
        if (!this.#altimetria || !altimetriaEl) {
            return;
        }

        fetch(this.#altimetria)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`No se pudo cargar ${this.#altimetria}`);
                }
                return res.text();
            })
            .then(svgTexto => {
                altimetriaEl.innerHTML = svgTexto;

                const svgEl = altimetriaEl.querySelector("svg");
                if (!svgEl) {
                    return;
                }

                const viewBox = svgEl.viewBox && svgEl.viewBox.baseVal
                    ? svgEl.viewBox.baseVal
                    : { x: 0, y: 0, width: 1000, height: 400 };

                const ancho = viewBox.width || 1000;
                const alto = viewBox.height || 400;

                const zonaUtil = this.#obtenerZonaUtilSVG(svgEl);
                const xInicioGrafica = zonaUtil ? zonaUtil.xInicio : 60;
                const xFinGrafica = zonaUtil ? zonaUtil.xFin : (ancho - 60);

                const distanciaMin = Math.min(...this.#hitos.map(h => h.distancia));
                const distanciaMax = Math.max(...this.#hitos.map(h => h.distancia));

                this.#hitos.forEach((hito, indice) => {
                    let x = xInicioGrafica;

                    if (distanciaMax !== distanciaMin) {
                        x = xInicioGrafica +
                            ((hito.distancia - distanciaMin) * (xFinGrafica - xInicioGrafica)) /
                            (distanciaMax - distanciaMin);
                    }

                    const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    linea.setAttribute("x1", x);
                    linea.setAttribute("y1", 20);
                    linea.setAttribute("x2", x);
                    linea.setAttribute("y2", alto - 20);
                    linea.setAttribute("stroke", "black");
                    linea.setAttribute("stroke-dasharray", "4 3");
                    linea.setAttribute("stroke-width", "1");
                    svgEl.appendChild(linea);

                    const textoHorizontal = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    textoHorizontal.setAttribute("x", x + 4);
                    textoHorizontal.setAttribute("y", indice % 2 === 0 ? 30 : 48);
                    textoHorizontal.setAttribute("font-size", "12");
                    textoHorizontal.textContent = `${hito.nombre} (${hito.distancia} km)`;
                    svgEl.appendChild(textoHorizontal);

                    const textoVertical = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    textoVertical.setAttribute("x", x - 4);
                    textoVertical.setAttribute("y", alto - 8);
                    textoVertical.setAttribute("font-size", "11");
                    textoVertical.setAttribute("transform", `rotate(-90 ${x - 4} ${alto - 8})`);
                    textoVertical.textContent = hito.nombre;
                    svgEl.appendChild(textoVertical);
                });
            })
            .catch(err => console.error("Error al cargar altimetría:", err));
    }
}

class GestorRutas {
    #rutas;
    #contenedorRutas;

    constructor(contenedorRutas) {
        this.#rutas = [];
        this.#contenedorRutas = contenedorRutas;
    }

    cargarXML(url) {
        $.ajax({
            url: url,
            dataType: "xml",
            success: xml => this.#procesarXML(xml),
            error: () => {
                this.#contenedorRutas.append(
                    $("<p>").text("No se pudo cargar rutas.xml")
                );
                console.error("No se pudo cargar rutas.xml");
            }
        });
    }

    #procesarXML(xml) {
        $(xml).find("ruta").each((_, elem) => {
            const ruta = new Ruta(elem);
            this.#rutas.push(ruta);

            const representacion = ruta.crearDOM();
            this.#contenedorRutas.append(representacion.$elemento);

            ruta.cargarPlanimetria(representacion.mapaEl);
            ruta.cargarAltimetria(representacion.altimetriaEl);
        });
    }
}

window.initMap = function () {
    const $main = $("main");

    if ($main.length === 0) {
        console.error("No se encontró el elemento main");
        return;
    }

    const $seccionRutas = $("<section>");
    const $titulo = $("<h2>").text("Rutas de Asturias");

    $seccionRutas.append($titulo);
    $main.append($seccionRutas);

    const gestor = new GestorRutas($seccionRutas);
    gestor.cargarXML("xml/rutas.xml");
};