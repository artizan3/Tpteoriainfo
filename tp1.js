const fs = require('fs');
const archivo = fs.openSync('a.txt', 'r');

function leerProximoBit() {
    if (bitsLeidos % 8 === 0) {
      // Si hemos leído 8 bits (1 byte), leemos el próximo byte del archivo
      const bytesRead = fs.readSync(archivo, buffer, 0, 1, null);
      if (bytesRead === 0) {
        // Hemos llegado al final del archivo
        fs.closeSync(archivo);
        return null;
      }
    }
}