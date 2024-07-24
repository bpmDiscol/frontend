import { differenceInMinutes, parseISO } from "date-fns";
import monthNames from "./monthNames.json";
// import formatDuration from "./formatDuration";

export default function calcularTiempoPromedioPorActividad(
  approvations,
  requestProcess
) {
  const milisecPorMinuto = 60000;
  const tiempos = {};
  const tiemposMes = {};
  const contrataciones = {};



  approvations?.forEach((approvationTaskList, index) => {
    const requestArea = requestProcess[index].requestArea;

    const approvationDate = parseISO(requestProcess[index].modifyedAt);
    const approvationYear = approvationDate.getFullYear();
    const approvationMonth = approvationDate.getMonth();
    const approvationDateKey = `${monthNames[approvationMonth]}, ${approvationYear}`;

    approvationTaskList.forEach((entry, index) => {
      if (!tiempos[entry.taskName]) {
        tiempos[entry.taskName] = {
          total: 0,
          count: 0,
          pending: [],
        };
      }

      if (!contrataciones[requestArea]) contrataciones[requestArea] = {};
      if (!contrataciones[requestArea][approvationDateKey])
        contrataciones[requestArea][approvationDateKey] = {
          candidates: 0,
          final: 0,
        };

      if (
        entry.taskName === "load_curricullum" &&
        entry.response !== "undefined"
      )
        contrataciones[requestArea][approvationDateKey].candidates += parseInt(
          entry.response
        );
      if (entry.taskName === "sign_contract" && entry.response !== "undefined")
        contrataciones[requestArea][approvationDateKey].final += parseInt(
          entry.response
        );

      if (entry.response === "undefined") {
        const start = new Date(entry.responseDate).getTime();
        const startDate = parseISO(entry.responseDate);
        const month = startDate.getMonth();
        const year = startDate.getFullYear();
        const monthKey = `${monthNames[month]}, ${year}`;

        let pending = true;
        for (let i = index; i < approvationTaskList.length; i++) {
          if (
            approvationTaskList[i].taskName === entry.taskName &&
            approvationTaskList[i].response !== "undefined"
          ) {
            const end = new Date(approvationTaskList[i].responseDate).getTime();
            const diferencia = (end - start) / milisecPorMinuto;
            tiempos[entry.taskName].total += diferencia;
            tiempos[entry.taskName].count++;
            pending = false;

            const endDate = parseISO(approvationTaskList[i].responseDate);
            const timeDiference = differenceInMinutes(endDate, startDate);

            if (!tiemposMes[entry.taskName]) tiemposMes[entry.taskName] = {};
            if (!tiemposMes[entry.taskName][monthKey])
              tiemposMes[entry.taskName][monthKey] = { total: 0, count: 0 };
            tiemposMes[entry.taskName][monthKey].total += timeDiference;
            tiemposMes[entry.taskName][monthKey].count++;

            break;
          }
        }
        if (pending) {
          const end = Date.now();
          const waitingTime = (end - start) / milisecPorMinuto;

          tiempos[entry.taskName].pending.push({ waitingTime });
        }
      }
    });
  });

  const promedios = {};
  const promediosMes = {};

  for (const taskName in tiempos) {
    if (tiempos[taskName].count > 0) {
      promedios[taskName] = tiempos[taskName].total / tiempos[taskName].count;
    }
  }
  for (const taskName in tiemposMes) {
    promediosMes[taskName] = {};
    for (const period in tiemposMes[taskName]) {
      if (tiemposMes[taskName][period].count > 0) {
        promediosMes[taskName][period] =
          tiemposMes[taskName][period].total /
          tiemposMes[taskName][period].count;
      }
    }
  }
  return {
    contrataciones,
    tiempos,
    promedios,
    tiemposMes,
    promediosMes,
  };
}
