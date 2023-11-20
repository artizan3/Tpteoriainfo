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
    return colaPrioridad[0];
}

function generarTablaCodigosHuffman(arbol, codigo = '', tabla = {}) {
    if (arbol.caracter !== null) {
        tabla[arbol.caracter] = codigo;
    } else {
        generarTablaCodigosHuffman(arbol.izquierda, codigo + '1', tabla);
        generarTablaCodigosHuffman(arbol.derecha, codigo + '0', tabla);
    }
    return tabla;
}

function crearBin(nombreArchivo,vecfinal){
    const datosBinarios = Uint16Array.from(vecfinal);
    const rutaArchivo = nombreArchivo;

    fs.writeFile(rutaArchivo, datosBinarios, 'binary', (err) => {
        if (err) throw err;
        console.log('Datos binarios escritos en el archivo correctamente.');
    });

}

function intTobin(dato){
    const array=Array.from(String(dato),Number);
    let valor=0;
    for (let i=0;i<array.length;i++){
        valor+=array[i]*2**(array.length-1-i);
    }
    return valor;
}

function leer_bin(nombreArchivo){
    
    
}

function guardaTexto(vecfinal){
    vecfinal.unshift(vecfinal.length);
    const mapa=new Map;
    for (let i=1;i<vecfinal.length;i+=2)
        mapa.set(vecfinal[i],vecfinal[i+1]);
    for (let i=0;i<datosTXT.length;i++){
        vecfinal.push(mapa.get(datosTXT[i].charCodeAt(0)))
    }
}
function descomprimir(rutaArchivo){
    //pasos, en la pos 0, tenemos la cantidad que son para nuestro decode
    //se agrupan: clave cod
    //una vez terminamos de armar el diccionario sigue el texto en formato codigo
    //sn1 propongo bajar en contenido a un array (2byte pasarlos a 1 valor entero)
    //leer el primero armar un map clave valor e ir descomprimiendo 1 a 1 con el map
   
}
function main(){
    lectura_arch(setpar,suma);
    setpar=filtrar_codigo(setpar);
    const arbol=construirArbolHuffman(setpar);
    const tabla=generarTablaCodigosHuffman(arbol);
    const vecfinal=[];
    console.log(tabla);
    Object.entries(tabla).forEach(function([key, value]) {
        vecfinal.push(key.charCodeAt(0));
        vecfinal.push(intTobin(value));
    });
    guardaTexto(vecfinal);
    crearBin("compresionPrueba.bin",vecfinal);
    descomprimir("compresionPrueba.bin");
}