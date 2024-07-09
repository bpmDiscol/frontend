export default function formatDuration(duration) {
    if (duration < 60) {
      return `${duration} minutos`;
    } else if (duration < 24 * 60) {
      return `${(duration / 60).toFixed(2)} horas`;
    } else if (duration < 7 * 24 * 60) {
      return `${(duration / (24 * 60)).toFixed(2)} días`;
    } else if (duration < 30 * 24 * 60) {
      return `${(duration / (7 * 24 * 60)).toFixed(2)} semanas`;
    } else {
      return `${(duration / (30 * 24 * 60)).toFixed(2)} meses`;
    }
  }