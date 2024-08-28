import { differenceInMinutes, parseISO } from "date-fns";
import calcularTiempoPromedioPorActividad from "./tiempoMedioPorActividad";
import monthNames from "./monthNames.json";
import formatDuration from "./formatDuration";

export function getContratations(approvations, requestProcess) {
  if (!approvations && !requestProcess) return;
  const data = calcularTiempoPromedioPorActividad(approvations, requestProcess);
  return data?.contrataciones;
}

export function getContractsByDate(date, approvations, requestProcess) {
  if (!date) return;
  const contrataciones = getContratations(approvations, requestProcess);
  if (!contrataciones) return;
  let res = {};
  const areaList = Object.keys(contrataciones);
  areaList.forEach((area) => {
    const fecha = Object.keys(contrataciones[area]);
    fecha.forEach((fechaStr) => {
      if (fechaStr == date) {
        if (!res[area]) res[area] = { candidates: [], finales: [], places: [] };
        res[area].candidates.push(contrataciones[area][fechaStr].candidates);
        res[area].finales.push(contrataciones[area][fechaStr].final);
        res[area].places.push(contrataciones[area][fechaStr].places);
      }
    });
  });
  return res;
}
export function getContratationDates(approvations, requestProcess) {
  const contrataciones = getContratations(approvations, requestProcess);
  if (!contrataciones) return;
  let dates = [];
  let output = [];
  const areaList = Object.keys(contrataciones);
  areaList.forEach((area) => {
    const newDates = Object.keys(contrataciones[area]);
    newDates.forEach((date) => {
      if (!dates.includes(date)) {
        dates.push(date);
        output.push({
          label: date,
          value: date,
        });
      }
    });
  });
  return output;
}

export function deformatDate(date) {
  const dateString = date.split(", ");
  return {
    month: dateString[0],
    year: dateString[1],
  };
}

function refactorSteps(steps) {
  const refactor = [];
  steps.forEach((step, idx) => {
    const currentTask = step.taskName;
    const currentStep = {
      responsible: step.responsible,
      area: step.area,
      taskName: step.taskName,
    };
    if (step.response === "undefined") {
      currentStep.status = "process";
      currentStep.response = "undefined";
      currentStep.startDate = step.responseDate;
      const subStep = steps.slice(idx);
      subStep.forEach((step_) => {
        if (step_.taskName == currentTask && step_.response != "undefined") {
          //se encontro una tarea finalizada
          currentStep.response = step_.response;
          currentStep.status = "finish";
          currentStep.responsible = step_.responsible;
          const startDate = parseISO(step.responseDate);
          const endDate = parseISO(step_.responseDate);
          currentStep.totalTime = formatDuration(
            differenceInMinutes(endDate, startDate)
          );
        }
      });

      refactor.push(currentStep);
    }
  });
  return refactor;
}

export function getProcessLine(area, date, approvations, requestProcess, initiator) {
  const { month, year } = deformatDate(date);
  return requestProcess
    .map((process, index) => {
      if (process.requestArea === area || process.initiatorUser === initiator)  {
        return { ...process, approvations: approvations[index] };
      }
    })
    .filter((item) => item)
    .filter((process) => {
      const processDate = parseISO(process.modifyedAt);
      const processMonth = monthNames[processDate.getMonth()];
      const processYear = processDate.getFullYear();
      return processMonth == month && processYear == year;
    })
    .map((process) => {
      return {
        initiator: process.initiatorUser,
        isFinished: process.done,
        createdAt: process.createdAt,
        modifyedAt: process.modifyedAt,
        places: process.places,
        placeName: process.placeName,
        requestArea: process.requestArea,
        steps: refactorSteps(process.approvations),
      };
    });
}
