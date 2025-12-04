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

        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg")

    def addRect(self,x,y,width,height,fill, strokeWidth,stroke):
        ET.SubElement(
            self.raiz,
            'rect',
            x=x,
            y=y,
            width=width,
            height=height,
            fill=fill, 
            strokeWidth=strokeWidth,
            stroke=stroke
        )

    def addCircle(self, cx, cy, r, fill):
        ET.SubElement(
            self.raiz,
            'circle',
            cx=cx,
            cy=cy,
            r=r,
            fill=fill
        )
        
    def addLine(self, x1, y1, x2, y2, stroke, strokeWith):
        ET.SubElement(
            self.raiz,
            'line',
            x1=x1,
            y1=y1,
            x2=x2,
            y2=y2,
            stroke=stroke,
            strokeWith=strokeWith
        )

    def addPolyline(self, points, stroke, strokeWith, fill):
        ET.SubElement(
            self.raiz,
            'polyline',
            points=points,
            stroke=stroke,
            strokeWith=strokeWith,
            fill=fill
        )
        
    def addText(self, texto, x, y, fontFamily, fontSize, style):
        ET.SubElement(
            self.raiz,
            'text',
            x=x,
            y=y,
            fontFamily=fontFamily,
            fontSize=fontSize,
            style=style
        ).text=texto

    def escribir(self,nombreArchivoSVG):
        arbolSVG = ET.ElementTree(self.raiz)
        ET.indent(arbolSVG)
        arbolSVG.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)
    
    def ver(self):
        print("\nElemento raiz = ", self.raiz.tag)

        if self.raiz.text != None:
            print("Contenido = "    , self.raiz.text.strip('\n'))
        else:
            print("Contenido = "    , self.raiz.text)
        
        print("Atributos = "    , self.raiz.attrib)

        # Recorrido de los elementos del árbol
        for hijo in self.raiz.findall('.//'):
            print("\nElemento = " , hijo.tag)
            if hijo.text != None:
                print("Contenido = ", hijo.text.strip('\n'))
            else:
                print("Contenido = ", hijo.text)    
            print("Atributos = ", hijo.attrib)

def main():
    archivoXML = input('Introduzca un archivo XML = ')
    nombreSVG = "altimetria.svg"

    archivoSVG = Svg(archivoXML)

    puntos="50,150 50,200 200,200 200,100"
    archivoSVG.addRect('25','25','200','200','lime','4','pink')
    archivoSVG.addCircle('125','125','75','orange')
    archivoSVG.addLine('50','50','200','200','blue','4')
    archivoSVG.addPolyline(puntos,'red','4','none') 
    archivoSVG.addText('texto vertical','220','25','Verdana','55', 
                       "writing-mode: tb; glyph-orientation-vertical: 0;")
    archivoSVG.addText('texto horizontal','30','35','Verdana','55',"none")
    archivoSVG.ver()

    archivoSVG.escribir(nombreSVG)
    print("Creado el archivo: ", nombreSVG)

if __name__ == "__main__":
    main() 