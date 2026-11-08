const os = require('os');
const pc = require('picocolors');

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

function titulo(texto) {
  console.log(pc.bold(pc.cyan(texto)));
}

function linea(etiqueta, valor) {
  console.log(`  ${pc.dim(etiqueta.padEnd(14))}${valor}`);
}

function mostrarInforme() {
  const total = os.totalmem();
  const libre = os.freemem();
  const porcentajeUsado = ((total - libre) / total) * 100;
  const cpus = os.cpus();

  titulo('=== INFORME DEL SISTEMA ===');
  console.log();

  titulo('Equipo');
  linea('Nombre', pc.white(os.hostname()));
  linea('Usuario', pc.white(os.userInfo().username));
  console.log();

  titulo('Sistema');
  linea('SO', pc.green(`${os.type()} ${os.release()}`));
  linea('Versión', pc.white(os.version()));
  linea('Arquitectura', pc.white(os.arch()));
  console.log();

  titulo('Procesador');
  linea('Modelo', pc.white(cpus[0].model.trim()));
  linea('CPUs', pc.green(String(cpus.length)));
  console.log();

  titulo('Memoria');
  linea('Total', pc.white(formatearBytes(total)));
  linea('Libre', pc.white(formatearBytes(libre)));
  linea('Usada', colorearPorcentaje(porcentajeUsado));
  console.log();

  titulo('Tiempo activo');
  linea('Uptime', pc.green(formatearUptime(os.uptime())));
}

mostrarInforme();