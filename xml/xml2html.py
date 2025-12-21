import xml.etree.ElementTree as ET

class Html(object):
    def __init__(self, nombreArchivo):
        try:
            self.f = open(nombreArchivo, "w", encoding="utf-8")

        except IOError:
            print("No se pudo crear el archivo HTML")
            exit()

    def cabecera(self, titulo):
        self.f.write("<!DOCTYPE html>\n")
        self.f.write("<html lang='es'>\n")
        self.f.write("<head>\n")
        self.f.write("\t<meta charset='UTF-8'>\n")
        self.f.write(f"\t<title>{titulo}</title>\n")
        self.f.write("\t<link rel='stylesheet' type='text/css' href='../estilo/estilo.css' />\n")
        self.f.write("\t<link rel='stylesheet' type='text/css' href='../estilo/layout.css' />\n")
        self.f.write("\t<link rel='icon' href='../multimedia/favicon.png' />\n")
        self.f.write("</head>\n")
        self.f.write("<body>\n")

    def encabezado(self, texto):
        self.f.write(f"\t<header>\n\t\t<h1>{texto}</h1>\n\t</header>\n")

    def inicioMain(self):
        self.f.write("\t<main>\n")

    def finMain(self):
        self.f.write("\t</main>\n")

    def seccion(self, titulo):
        self.f.write(f"\t\t<section>\n\t\t\t<h2>{titulo}</h2>\n")

    def finSeccion(self):
        self.f.write("\t\t</section>\n")

    def parrafo(self, texto):
        self.f.write(f"\t\t\t<p>{texto}</p>\n")

    def listaInicio(self):
        self.f.write("\t\t\t<ul>\n")

    def listaElemento(self, texto):
        self.f.write(f"\t\t\t\t<li>{texto}</li>\n")

    def listaFin(self):
        self.f.write("\t\t\t</ul>\n")

    def cierre(self):
        self.f.write("</body>\n</html>")
        self.f.close()


def main():
    archivoXML = input("Introduzca un archivo XML = ")
    nombreHTML = "InfoCircuito.html"

    try:
        arbol = ET.parse(archivoXML)
    except:
        print("Error leyendo el archivo XML")
        exit()

    raiz = arbol.getroot()

    ns = {'ns': 'http://www.uniovi.es'}

    html = Html(nombreHTML)

    nombre = raiz.find('ns:nombre', ns).text

    html.cabecera(nombre)
    html.encabezado(nombre)
    html.inicioMain()

    html.seccion("Información general")
    html.parrafo(f"Largo: {raiz.find('ns:largo', ns).text} m")
    html.parrafo(f"Ancho: {raiz.find('ns:ancho', ns).text} m")
    html.parrafo(f"Fecha: {raiz.find('ns:fecha', ns).text}")
    html.parrafo(f"Hora: {raiz.find('ns:hora', ns).text}")
    html.parrafo(f"Vueltas: {raiz.find('ns:vueltas', ns).text}")
    html.parrafo(f"Localidad: {raiz.find('ns:localidad', ns).text}")
    html.parrafo(f"País: {raiz.find('ns:pais', ns).text}")
    html.parrafo(f"Patrocinador: {raiz.find('ns:patrocinador', ns).text}")
    html.finSeccion()

    html.seccion("Referencias")
    html.listaInicio()
    for ref in raiz.findall('.//ns:referencia', ns):
        html.listaElemento(f"<a href='{ref.text}'>{ref.text}</a>")
    html.listaFin()
    html.finSeccion()

    html.seccion("Galería de fotos")
    html.listaInicio()
    for foto in raiz.findall('.//ns:galeriaFotos/ns:foto', ns):
        html.listaElemento(foto.text)
    html.listaFin()
    html.finSeccion()

    html.seccion("Vídeos")
    html.listaInicio()
    for video in raiz.findall('.//ns:galeriaVideos/ns:video', ns):
        html.listaElemento(video.text)
    html.listaFin()
    html.finSeccion()

    html.seccion("Ganador")
    html.parrafo(f"Piloto: {raiz.find('.//ns:ganador/ns:piloto', ns).text}")
    html.parrafo(f"Tiempo: {raiz.find('.//ns:ganador/ns:tiempo', ns).text}")
    html.finSeccion()

    html.seccion("Clasificación final")
    html.listaInicio()
    for pos in raiz.findall('.//ns:clasificacion/ns:posicion', ns):
        html.listaElemento(
            f"Puesto {pos.attrib['puesto']}: "
            f"{pos.find('ns:piloto', ns).text} "
            f"({pos.find('ns:puntos', ns).text} puntos)"
        )
    html.listaFin()
    html.finSeccion()

    html.finMain()
    html.cierre()

    print("Creado el archivo:", nombreHTML)


if __name__ == "__main__":
    main()
