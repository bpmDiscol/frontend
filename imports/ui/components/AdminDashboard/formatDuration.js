export default function formatDuration(minutos) {
  if (minutos < 60) {
    return `${minutos} minuto${minutos !== 1 ? "s" : ""}`;
  } else if (minutos < 1440) {
    // 24 * 60
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas} hora${horas !== 1 ? "s" : ""}${
      minutosRestantes > 0
        ? ` y ${minutosRestantes} minuto${minutosRestantes !== 1 ? "s" : ""}`
        : ""
    }`;
  } else {
    const dias = Math.floor(minutos / 1440);
    const horasRestantes = Math.floor((minutos % 1440) / 60);
    const minutosRestantes = minutos % 60;
    return `${dias} día${dias !== 1 ? "s" : ""}${
      horasRestantes > 0
        ? `, ${horasRestantes} hora${horasRestantes !== 1 ? "s" : ""}`
        : ""
    }${
      minutosRestantes > 0
        ? ` y ${minutosRestantes} minuto${minutosRestantes !== 1 ? "s" : ""}`
        : ""
    }`;
  }
}
