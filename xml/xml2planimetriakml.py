import xml.etree.ElementTree as ET
import os

class KmlRutas(object):
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

    def crearEstructuraKML(self):
        raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        doc = ET.SubElement(raiz, 'Document')
        return raiz, doc

    def addPlacemark(self, doc, nombre, descripcion, coordenadas):
        pm = ET.SubElement(doc, 'Placemark')
        ET.SubElement(pm, 'name').text = nombre
        ET.SubElement(pm, 'description').text = descripcion

        punto = ET.SubElement(pm, 'Point')
        ET.SubElement(punto, 'coordinates').text = coordenadas
        ET.SubElement(punto, 'altitudeMode').text = "relativeToGround"

    def addLineString(self, doc, nombre, listaCoordenadas, color="#ff0000ff", ancho="4"):
        pm = ET.SubElement(doc, 'Placemark')
        ET.SubElement(pm, 'name').text = nombre

        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls, 'extrude').text = "1"
        ET.SubElement(ls, 'tessellation').text = "1"
        ET.SubElement(ls, 'coordinates').text = "\n".join(listaCoordenadas)
        ET.SubElement(ls, 'altitudeMode').text = "relativeToGround"

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement(linea, 'color').text = color
        ET.SubElement(linea, 'width').text = ancho

    def generarKMLs(self):
        rutas = self.arbolXML.getroot().findall('u:ruta', self.ns)

        print("Rutas encontradas:", len(rutas))

        for ruta in rutas:
            nombreRuta = ruta.find('u:nombre', self.ns).text
            descripcion = ruta.find('u:descripcion', self.ns).text

            raiz, doc = self.crearEstructuraKML()

            coordsInicio = ruta.find('u:coordenadas', self.ns)
            lon = coordsInicio.find('u:longitud', self.ns).text
            lat = coordsInicio.find('u:latitud', self.ns).text
            alt = coordsInicio.find('u:altitud', self.ns).text

            coordenadaInicio = f"{lon},{lat},{alt}"

            self.addPlacemark(
                doc,
                f"Inicio - {nombreRuta}",
                descripcion,
                coordenadaInicio
            )

            listaCoordenadas = []
            hitos = ruta.findall('.//u:hito', self.ns)

            for hito in hitos:
                coords = hito.find('u:coordenadas', self.ns)
                lon = coords.find('u:longitud', self.ns).text
                lat = coords.find('u:latitud', self.ns).text
                alt = coords.find('u:altitud', self.ns).text

                listaCoordenadas.append(f"{lon},{lat},{alt}")

            self.addLineString(
                doc,
                f"Ruta - {nombreRuta}",
                listaCoordenadas
            )

            nombreArchivo = nombreRuta.replace(" ", "_") + ".kml"

            arbolKML = ET.ElementTree(raiz)
            ET.indent(arbolKML)
            arbolKML.write(nombreArchivo, encoding='utf-8', xml_declaration=True)

            print("Archivo generado:", nombreArchivo)


def main():
    archivoXML = input("Introduzca el archivo XML de rutas = ")
    generador = KmlRutas(archivoXML)
    generador.generarKMLs()


if __name__ == "__main__":
    main()