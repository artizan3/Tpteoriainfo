const { Console } = require('console');
const fs = require('fs');
class Nodo {
    constructor(caracter, frecuencia) {
        this.caracter = caracter;
        this.frecuencia = frecuencia;
        this.izquierda = null;
        this.derecha = null;
    }
}
let datosTXT=[];
let setpar=new Map;
let suma=0;
main();
function generarTablaCodigosHuffman(arbol, codigo = '', tabla = {}) {
    if (arbol.caracter !=null) {
        tabla[arbol.caracter] = codigo;
    } else {
        generarTablaCodigosHuffman(arbol.izquierda, codigo + '1', tabla);
        generarTablaCodigosHuffman(arbol.derecha, codigo + '0', tabla);
    }
    return tabla;
}
function lectura_arch(setpar,suma){
    const fs = require('fs');
    if (process.argv[2]!=undefined && fs.existsSync(process.argv[2])){
        var contenido=fs.readFileSync(process.argv[2],'ASCII');
        datosTXT=contenido.split('');
        for (let i=0;i<datosTXT.length;i++){
            var palabra=datosTXT[i];
            for (let j=0;j<palabra.length;j++){
                if (setpar.has(palabra[j])){
                    let valor=setpar.get(palabra[j]);
                    valor++;
                    setpar.set(palabra[j],valor);
                }else{
                    setpar.set(palabra[j],1); 
                }
                suma++;
            }
        }
        return true;
    }else
        return false;
}

function filtrar_codigo(setpar){
    const arrayOrdenado = Array.from(setpar.entries());
    arrayOrdenado.sort(function(a, b) {
        return a[1] - b[1];
    });
    return new Map(arrayOrdenado);
}

function construirArbolHuffman(datos) {
    const colaPrioridad = [];
    setpar.forEach((valor, clave) => {
        const nodo = new Nodo(clave, valor);
        colaPrioridad.push(nodo);
    }); 
    while (colaPrioridad.length > 1) {
        colaPrioridad.sort((a, b) => a.frecuencia - b.frecuencia);

        const nodoIzquierda = colaPrioridad.shift();
        const nodoDerecha = colaPrioridad.shift();

        const nuevoNodo = new Nodo(null, nodoIzquierda.frecuencia + nodoDerecha.frecuencia);
        nuevoNodo.izquierda = nodoIzquierda;
        nuevoNodo.derecha = nodoDerecha;

        colaPrioridad.push(nuevoNodo);
    }
    nodero=new Nodo();
    nodero=colaPrioridad[0];
    return nodero;
}

function intTobin(dato){
    const array=Array.from(String(dato),Number);
    let valor=0;
    for (let i=0;i<array.length;i++){
        valor+=array[i]*2**(array.length-1-i);
    }
    return valor;
}

function Comprimir(mapa,setpar){
    const vec=[];
    let bn=0;
    let byte=0b00000000;
    let aux;
    vec.push(setpar.size);
    setpar.forEach((valor, clave) => {
        vec.push(clave.charCodeAt(0));
        const pa=(valor&0b1111111100000000)>>8;
        const pb=(valor&0b0000000011111111);
        vec.push(pa);
        vec.push(pb);
    });
    for (let i=0;i<datosTXT.length;i++){
        const pal=mapa.get(datosTXT[i]);
        for (let k=0;k<pal.length;k++){
            byte=byte<<1
            if (pal[k]==1)
                byte|=0b00000001;
            bn++;
            if (bn==8){
                vec.push(byte);
                byte=0b00000000;
                bn=0;
            }
        }
    }
    const datosBinarios = Buffer.from(vec);

    const rutaArchivo = "Compressed.bin";
    fs.writeFile(rutaArchivo, datosBinarios, 'binary', (err) => {
        if (err) throw err;
        console.log('Datos binarios escritos en el archivo correctamente.');
        fs.closeSync(fs.openSync(rutaArchivo, 'r'));
    });
}

function Descomprimir(dir){
    const data = fs.readFileSync(dir);
    let num=0
    const mapa=new Map;

    for (let i=1;i<=data[0]*3;i+=3){
        num=0;
        num|=data[i+1]
        num=num<<8
        num|=data[i+2]
        mapa.set(String.fromCharCode(data[i]),num);
    }

    let arbol=construirArbolHuffman(mapa);
    const raiz=construirArbolHuffman(mapa);

    let i=data[0]*3+1;
    let byte=data[i];
    let bn=7;
    const vec=[];
    let bit;

    while (i<data.length){
        bit=(byte>>bn)&0b1;
        if (arbol.caracter == null) {
            if (bit==1)
                arbol=arbol.izquierda;
            else
                arbol=arbol.derecha;
        }
        if (arbol.caracter!=null){
            vec.push(arbol.caracter);
            arbol=raiz;
        }
        bn--
        if (bn==-1){
            bn=7;
            i++;
            byte=data[i];
        }
    }

    fs.writeFileSync('Compressed.txt', vec.join(''));
}

function main(){
    if (process.argv[3]=='-c'){
        lectura_arch(setpar,suma);
        setpar=filtrar_codigo(setpar);
        const arbol=construirArbolHuffman(setpar);
        const raiz=construirArbolHuffman(setpar);
        const tabla=generarTablaCodigosHuffman(arbol);
        const mapafinal=new Map;
        Object.entries(tabla).forEach(function([key, value]) {
            mapafinal.set(key,value);
        });
        Comprimir(mapafinal,setpar);
    }else
        Descomprimir("Compressed.bin");
}