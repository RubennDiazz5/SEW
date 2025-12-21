import xml.etree.ElementTree as ET

class Svg(object):
    def __init__(self, archivo):
        try:
            self.arbolXML = ET.parse(archivo)
        
        except IOError:
            print ('No se encuentra el archivo ', archivo)
            exit()
            
        except ET.ParseError:
            print("Error procesando en el archivo XML = ", archivo)
            exit()

        self.raiz = ET.Element(
            'svg', 
            xmlns="http://www.w3.org/2000/svg",
            width="800",
            height="450",
            viewBox="0 0 800 450"
        )
        
    def addLine(self, x1, y1, x2, y2, stroke, strokeWidth):
        ET.SubElement(
            self.raiz,
            'line',
            x1=x1,
            y1=y1,
            x2=x2,
            y2=y2,
            stroke=stroke,
            **{'stroke-width': strokeWidth}  # CORREGIDO**
        )

    def addPolyline(self, points, stroke, strokeWidth, fill):
        ET.SubElement(
            self.raiz,
            'polyline',
            points=points,
            stroke=stroke,
            **{'stroke-width': strokeWidth},  # CORREGIDO
            fill=fill
        )

    def addText(self, texto, x, y, fontFamily, fontSize, style):
        ET.SubElement(
            self.raiz,
            'text',
            x=x,
            y=y,
            **{'font-family': fontFamily},   # CORREGIDO
            **{'font-size': fontSize},       # CORREGIDO
            style=style
        ).text = texto

    def escribir(self,nombreArchivoSVG):
        arbolSVG = ET.ElementTree(self.raiz)
        ET.indent(arbolSVG)
        arbolSVG.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)

def main():
    archivoXML = input('Introduzca un archivo XML = ')
    nombreSVG = "altimetria.svg"
    ns = {'ns': 'http://www.uniovi.es'}

    archivoSVG = Svg(archivoXML)

    tramos = archivoSVG.arbolXML.findall('.//ns:tramo', ns)

    alt_origen = float(
        archivoSVG.arbolXML.find(
            './/ns:origen/ns:coordenadas/ns:altitud', ns
        ).text
    )

    dist_acumulada = 0
    distancias = [0]
    altitudes = [alt_origen]

    for tramo in tramos:
        d = float(tramo.find('ns:distancia', ns).text)
        a = float(tramo.find('ns:coordenadas/ns:altitud', ns).text)

        dist_acumulada += d
        distancias.append(dist_acumulada)
        altitudes.append(a)

    ancho = 800
    alto = 400
    margen = 50

    max_dist = max(distancias)
    min_alt = min(altitudes)
    max_alt = max(altitudes)

    puntos = ""

    for d, a in zip(distancias, altitudes):
        x = margen + (d / max_dist) * (ancho - 2 * margen)
        y = alto - margen - ((a - min_alt) / (max_alt - min_alt)) * (alto - 2 * margen)
        puntos += f"{x},{y} "

    puntos += f"{ancho - margen},{alto - margen} "
    puntos += f"{margen},{alto - margen}"

    archivoSVG.addLine(str(margen), str(margen), str(margen), str(alto - margen), "black", "2")
    archivoSVG.addLine(str(margen), str(alto - margen), str(ancho - margen), str(alto - margen), "black", "2")

    archivoSVG.addText("Altitud (m)", "15", "200", "Verdana", "14",
                "writing-mode: tb; glyph-orientation-vertical: 0;")
    archivoSVG.addText("Distancia (m)", "350", "390", "Verdana", "14", "none")

    archivoSVG.addPolyline(puntos, "blue", "2", "lightblue")

    archivoSVG.escribir(nombreSVG)
    print("Creado el archivo: ", nombreSVG)

if __name__ == "__main__":
    main() 