import xml.etree.ElementTree as ET

class Kml(object):
    def __init__(self, archivo):
        try:
            self.arbolXML = ET.parse(archivo)
        
        except IOError:
            print ('No se encuentra el archivo ', archivo)
            exit()
            
        except ET.ParseError:
            print("Error procesando en el archivo XML = ", archivo)
            exit()

        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz,'Document')

    def addPlacemark(self, nombre, descripcion, listaCoordenadas, modoAltitud):
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = nombre
        ET.SubElement(pm,'description').text = descripcion

        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = listaCoordenadas
        ET.SubElement(punto,'altitudeMode').text = modoAltitud

    def addLineString(self, nombre, extrude, tesela, listaCoordenadas, modoAltitud, color, ancho):
        ET.SubElement(self.doc,'name').text = nombre
        
        pm = ET.SubElement(self.doc,'Placemark')
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls,'extrude').text = extrude
        ET.SubElement(ls,'tessellation').text = tesela
        ET.SubElement(ls,'coordinates').text = listaCoordenadas
        ET.SubElement(ls,'altitudeMode').text = modoAltitud

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement (linea, 'color').text = color
        ET.SubElement (linea, 'width').text = ancho

    def obtenerCoordenadas(self, XPathexpr):
        listaCoordenadas = []
        ns = {'u': 'http://www.uniovi.es'}

        for tramo in self.arbolXML.getroot().findall(XPathexpr, namespaces=ns):
            coords = tramo.find('u:coordenadas', namespaces=ns)
            if coords is not None:
                lon = coords.find('u:longitud', namespaces=ns).text
                lat = coords.find('u:latitud', namespaces=ns).text
                alt = coords.find('u:altitud', namespaces=ns).text

                listaCoordenadas.append(f"{lon},{lat},{alt}")

        return listaCoordenadas

    def escribir(self, nombreArchivoKML):
        arbolKML = ET.ElementTree(self.raiz)
        ET.indent(arbolKML)
        arbolKML.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

def main():
    archivoXML = input('Introduzca un archivo XML = ')
    nombreKML = "circuito.kml"
    coordenadasOrigenXPath = './/{http://www.uniovi.es}origen'
    coordenadasTramosXPath = './/{http://www.uniovi.es}tramo'
    
    archivoKML = Kml(archivoXML)
    listaCoordenadasOrigen = archivoKML.obtenerCoordenadas(coordenadasOrigenXPath)
    listaCoordenadasTramos = archivoKML.obtenerCoordenadas(coordenadasTramosXPath)

    archivoKML.addPlacemark(
        'Origen',
        'Origen del circuito',
        "\n".join(listaCoordenadasOrigen),
        'relativeToGround'
    )
    
    archivoKML.addLineString(
        "Ruta circuito",
        "1",
        "1",
        "\n".join(listaCoordenadasTramos),
        'relativeToGround',
        '#ff0000ff',
        "5"
    )

    primeraLinea = [listaCoordenadasOrigen[0], listaCoordenadasTramos[0]]
    archivoKML.addLineString(
        "Origen → Primer tramo",
        "1",
        "1",
        "\n".join(primeraLinea),
        'relativeToGround',
        '#ff0000ff',
        "5"
    )

    ultimaLinea = [listaCoordenadasTramos[-1], listaCoordenadasOrigen[0]]
    archivoKML.addLineString(
        "Último tramo → Origen",
        "1",
        "1",
        "\n".join(ultimaLinea),
        'relativeToGround',
        '#ff0000ff',
        "5"
    )
    
    archivoKML.escribir(nombreKML)
    print("Creado el archivo: ", nombreKML)

if __name__ == "__main__":
    main() 
