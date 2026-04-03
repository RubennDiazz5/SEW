"use strict";

class Juego {
    #preguntas
    #respuestasUsuario
    #indice

    constructor() {
        this.#indice = 0;
        this.#respuestasUsuario = [];
        this.#preguntas = [
            {
                pregunta: "¿Cuál es la capital de Asturias?",
                opciones: ["Gijón", "Oviedo", "Avilés", "Llanes", "Cudillero"],
                correcta: 1
            },
            {
                pregunta: "¿Qué plato típico se menciona en la sección de gastronomía?",
                opciones: ["Fabada", "Paella", "Gazpacho", "Cocido", "Tortilla"],
                correcta: 0
            },
            {
                pregunta: "¿Qué página contiene rutas de la provincia?",
                opciones: ["gastronomia", "rutas", "meteorologia", "juego", "reservas"],
                correcta: 1
            },
            {
                pregunta: "¿Qué recurso aparece primero en el carrusel de imágenes?",
                opciones: ["Mapa de la provincia", "Playa", "Montaña", "Museo", "Parque"],
                correcta: 0
            },
            {
                pregunta: "¿Qué sección ofrece información sobre reservas en la provincia?",
                opciones: ["gastronomia", "rutas", "meteorologia", "reservas", "juego"],
                correcta: 3
            },
            {
                pregunta: "¿Qué sección muestra noticias recientes sobre Asturias?",
                opciones: ["Inicio", "Gastronomía", "Rutas", "Meteorología", "Juego"],
                correcta: 0
            },
            {
                pregunta: "¿Qué información se encuentra en la sección de meteorología?",
                opciones: [
                    "Temperatura actual y previsión 7 días",
                    "Mapa turístico de la provincia",
                    "Listado de restaurantes",
                    "Noticias deportivas",
                    "Galería de fotos"
                ],
                correcta: 0
            },
            {
                pregunta: "¿Cuántas opciones de respuesta tiene cada pregunta en el juego?",
                opciones: ["3", "4", "5", "6", "10"],
                correcta: 2
            },
            {
                pregunta: "¿Qué enlace del menú lleva al juego?",
                opciones: ["gastronomia", "rutas", "meteorologia", "juego", "reservas"],
                correcta: 3
            },
            {
                pregunta: "¿Qué título aparece en la cabecera principal de la página?",
                opciones: [
                    "Asturias Desktop",
                    "Bienvenido a Asturias",
                    "Portal de Asturias",
                    "Descubre Asturias",
                    "Asturias Turismo"
                ],
                correcta: 0
            }
        ];
    }

    iniciarJuego() {
        this.#indice = 0;
        this.#respuestasUsuario = [];
        this.mostrarPregunta();
    }

    mostrarPregunta() {
        const main = $("main");
        main.empty();

        if (this.#indice >= this.#preguntas.length) {
            this.mostrarResultado();
            return;
        }

        const preguntaObj = this.#preguntas[this.#indice];

        const h2 = $("<h2>").text(`Pregunta ${this.#indice + 1} de ${this.#preguntas.length}`);
        const p = $("<p>").text(preguntaObj.pregunta);
        const ul = $("<ul>");

        preguntaObj.opciones.forEach((opcion, index) => {
            const li = $("<li>");
            const boton = $("<button>").text(opcion);
            boton.on("click", () => {
                this.#respuestasUsuario.push(index);
                this.#indice++;
                this.mostrarPregunta();
            });
            li.append(boton);
            ul.append(li);
        });

        main.append(h2, p, ul);
    }

    mostrarResultado() {
        const main = $("main");
        main.empty();

        let aciertos = 0;
        for (let i = 0; i < this.#preguntas.length; i++) {
            if (this.#respuestasUsuario[i] === this.#preguntas[i].correcta) {
                aciertos++;
            }
        }

        const h2 = $("<h2>").text("¡Juego finalizado!");
        const p = $("<p>").text(`Tu puntuación: ${aciertos} de ${this.#preguntas.length}`);

        const botonReiniciar = $("<button>").text("Volver a jugar");
        botonReiniciar.on("click", () => this.iniciarJuego());

        main.append(h2, p, botonReiniciar);
    }
}

window.addEventListener("load", () => {
    const juego = new Juego();
    juego.iniciarJuego();
});