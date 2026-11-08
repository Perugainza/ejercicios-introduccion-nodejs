const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

const ruta = process.argv[2] || '.';

if (!fs.existsSync(ruta) || !fs.statSync(ruta).isDirectory()) {
  console.error(pc.bgRed(pc.white(` Error: la ruta "${ruta}" no existe o no es una carpeta `)));
  process.exit(1);
}

const entradas = fs.readdirSync(ruta, { withFileTypes: true });
let carpetas = 0;
let archivos = 0;
let totalBytes = 0;

for (const entrada of entradas) {
  const oculto = entrada.name.startsWith('.');

  if (entrada.isDirectory()) {
    carpetas++;
    const texto = `${entrada.name}/`;
    console.log(oculto ? pc.gray(texto) : pc.blue(texto));
  } else {
    archivos++;
    const tamano = fs.statSync(path.join(ruta, entrada.name)).size;
    totalBytes += tamano;
    const nombre = oculto ? pc.gray(entrada.name) : pc.green(entrada.name);
    console.log(`${nombre} ${pc.gray(formatearTamano(tamano))}`);
  }
}

console.log();
console.log(`${carpetas} carpetas, ${archivos} archivos, ${formatearTamano(totalBytes)} en total`);