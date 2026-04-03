import xml.etree.ElementTree as ET

class SvgRutas(object):

    def __init__(self, archivo):
        try:
            self.arbolXML = ET.parse(archivo)
        except IOError:
            print('No se encuentra el archivo ', archivo)
            exit()
        except ET.ParseError:
            print("Error procesando el archivo XML = ", archivo)
            exit()

        self.ns = {'u': 'http://www.uniovi.es'}

    def crearSVG(self):
        return ET.Element(
            'svg',
            xmlns="http://www.w3.org/2000/svg",
            width="1000",
            height="600",
            viewBox="0 0 1000 600"
        )

    def addLine(self, raiz, x1, y1, x2, y2):
        ET.SubElement(
            raiz, 'line',
            x1=str(x1), y1=str(y1),
            x2=str(x2), y2=str(y2),
            stroke="black",
            **{'stroke-width': "2"}
        )

    def addText(self, raiz, texto, x, y):
        ET.SubElement(
            raiz, 'text',
            x=str(x),
            y=str(y),
            **{'font-size': "14"},
            **{'font-family': "Verdana"}
        ).text = texto

    def generarAltimetrias(self):

        rutas = self.arbolXML.findall('.//{http://www.uniovi.es}ruta')

        for ruta in rutas:

            nombreRuta = ruta.find('{http://www.uniovi.es}nombre').text
            nombreArchivo = nombreRuta.replace(" ", "_") + ".svg"

            raizSVG = self.crearSVG()

            alt_inicio = float(
                ruta.find('{http://www.uniovi.es}coordenadas/'
                          '{http://www.uniovi.es}altitud').text
            )

            distancias = [0]
            altitudes = [alt_inicio]

            hitos = ruta.findall('.//{http://www.uniovi.es}hito')

            for hito in hitos:
                distancia_km = float(
                    hito.find('{http://www.uniovi.es}distancia').text
                )
                altitud = float(
                    hito.find('{http://www.uniovi.es}coordenadas/'
                              '{http://www.uniovi.es}altitud').text
                )

                distancias.append(distancia_km * 1000)
                altitudes.append(altitud)

            ancho = 1000
            alto = 600
            margen = 80

            max_dist = max(distancias)
            min_alt = min(altitudes)
            max_alt = max(altitudes)

            puntos = []

            for d, a in zip(distancias, altitudes):

                x = margen + (d / max_dist) * (ancho - 2 * margen)

                if max_alt != min_alt:
                    y = alto - margen - (
                        (a - min_alt) / (max_alt - min_alt)
                    ) * (alto - 2 * margen)
                else:
                    y = alto / 2

                puntos.append(f"{x},{y}")

            puntos.append(f"{ancho - margen},{alto - margen}")
            puntos.append(f"{margen},{alto - margen}")

            puntos_str = " ".join(puntos)

            self.addLine(raizSVG, margen, margen, margen, alto - margen)
            self.addLine(raizSVG, margen, alto - margen, ancho - margen, alto - margen)

            pasos_x = 5
            for i in range(pasos_x + 1):
                x = margen + i * (ancho - 2 * margen) / pasos_x
                distancia_label = int(i * max_dist / pasos_x)
                self.addLine(raizSVG, x, alto - margen, x, alto - margen + 10)
                self.addText(raizSVG, f"{distancia_label} m", x - 20, alto - margen + 30)

            pasos_y = 5
            for i in range(pasos_y + 1):
                y = alto - margen - i * (alto - 2 * margen) / pasos_y
                alt_label = int(min_alt + i * (max_alt - min_alt) / pasos_y)
                self.addLine(raizSVG, margen - 10, y, margen, y)
                self.addText(raizSVG, f"{alt_label} m", 10, y + 5)

            ET.SubElement(
                raizSVG,
                'polyline',
                points=puntos_str,
                stroke="blue",
                **{'stroke-width': "3"},
                fill="lightblue"
            )

            self.addText(raizSVG, f"Altimetría - {nombreRuta}", 350, 40)

            arbolSVG = ET.ElementTree(raizSVG)
            ET.indent(arbolSVG)
            arbolSVG.write(nombreArchivo, encoding='utf-8', xml_declaration=True)

            print("Archivo generado:", nombreArchivo)


def main():
    archivoXML = input("Introduzca el archivo XML de rutas = ")
    generador = SvgRutas(archivoXML)
    generador.generarAltimetrias()


if __name__ == "__main__":
    main()