export class timeCounter {
  constructor() {
    this.time = 0;
    this.intervalId = null;
  }

  start() {
    if ((this.intervalId)) return;
    this.intervalId = setInterval(() => {
      this.time++;
    }, 60000); //tiempo en minutos
  }

  reset() {
    this.stop();
    this.time = 0;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  getTime() {
    return this.time;
  }
}
