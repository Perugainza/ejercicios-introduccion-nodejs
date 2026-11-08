const os = require('os');
const fs = require('fs');
const path = require('path');
const pc = require('picocolors');

const ARCHIVO_INFORME = path.join(__dirname, 'informe.txt');
const ARCHIVO_HISTORIAL = path.join(__dirname, 'historial.log');

function formatearBytes(bytes) {
  return (bytes / 1024 ** 3).toFixed(2) + ' GB';
}

function formatearUptime(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  return `${h}h ${m}m`;
}

function colorearPorcentaje(porcentaje) {
  const texto = porcentaje.toFixed(1) + '%';
  if (porcentaje < 60) return pc.green(texto);
  if (porcentaje <= 85) return pc.yellow(texto);
  return pc.red(texto);
}

function formatearFecha(fecha) {
  const dos = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())} ` +
    `${dos(fecha.getHours())}:${dos(fecha.getMinutes())}:${dos(fecha.getSeconds())}`;
}

function recogerDatos() {
  const total = os.totalmem();
  const libre = os.freemem();
  const cpus = os.cpus();
  return {
    host: os.hostname(),
    usuario: os.userInfo().username,
    so: `${os.type()} ${os.release()}`,
    version: os.version(),
    arch: os.arch(),
    cpuModelo: cpus[0].model.trim(),
    cpuNum: cpus.length,
    total,
    libre,
    porcentaje: ((total - libre) / total) * 100,
    uptime: os.uptime(),
  };
}

// Texto plano (SIN colores): es lo que se guarda en el archivo
function construirTexto(d) {
  return [
    '=== INFORME DEL SISTEMA ===',
    '',
    'Equipo',
    `  Nombre:        ${d.host}`,
    `  Usuario:       ${d.usuario}`,
    '',
    'Sistema',
    `  SO:            ${d.so}`,
    `  Versión:       ${d.version}`,
    `  Arquitectura:  ${d.arch}`,
    '',
    'Procesador',
    `  Modelo:        ${d.cpuModelo}`,
    `  CPUs:          ${d.cpuNum}`,
    '',
    'Memoria',
    `  Total:         ${formatearBytes(d.total)}`,
    `  Libre:         ${formatearBytes(d.libre)}`,
    `  Usada:         ${d.porcentaje.toFixed(1)}%`,
    '',
    'Tiempo activo',
    `  Uptime:        ${formatearUptime(d.uptime)}`,
    '',
  ].join('\n');
}

// Versión con colores: SOLO para la consola
function mostrarInforme(d) {
  const titulo = (t) => console.log(pc.bold(pc.cyan(t)));
  const linea = (e, v) => console.log(`  ${pc.dim(e.padEnd(14))}${v}`);

  titulo('=== INFORME DEL SISTEMA ===');
  console.log();
  titulo('Equipo');
  linea('Nombre', pc.white(d.host));
  linea('Usuario', pc.white(d.usuario));
  console.log();
  titulo('Sistema');
  linea('SO', pc.green(d.so));
  linea('Versión', pc.white(d.version));
  linea('Arquitectura', pc.white(d.arch));
  console.log();
  titulo('Procesador');
  linea('Modelo', pc.white(d.cpuModelo));
  linea('CPUs', pc.green(String(d.cpuNum)));
  console.log();
  titulo('Memoria');
  linea('Total', pc.white(formatearBytes(d.total)));
  linea('Libre', pc.white(formatearBytes(d.libre)));
  linea('Usada', colorearPorcentaje(d.porcentaje));
  console.log();
  titulo('Tiempo activo');
  linea('Uptime', pc.green(formatearUptime(d.uptime)));
  console.log();
}

function main() {
  const datos = recogerDatos();

  mostrarInforme(datos);

  fs.writeFileSync(ARCHIVO_INFORME, construirTexto(datos));

  const lineaHistorial = `${formatearFecha(new Date())} | RAM usada: ${Math.round(datos.porcentaje)}%\n`;
  fs.appendFileSync(ARCHIVO_HISTORIAL, lineaHistorial);

  console.log(pc.green('✔ Informe guardado en informe.txt'));
}

main();