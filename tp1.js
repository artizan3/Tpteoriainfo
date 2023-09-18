leerProximoBit();
function leerProximoBit() {
    const fs = require('fs');
    const archivo = fs.openSync('prueba.bin', 'r');
    var matbin=new Array;
    matbin=[[0,0],[0,0]];

    const buffer = Buffer.alloc(1);

    let bytesRead;
    let a=-1;
    while ((bytesRead = fs.readSync(archivo, buffer, 0, 1, null)) !== 0) {
        for (let i=7;i>=0;i--){
            var b=(buffer[0]>>i)&1;
            if (a!=-1)
                matbin[b][a]++;
            a=b;
        }
    }
    console.log(matbin);
    fs.closeSync(archivo);
}