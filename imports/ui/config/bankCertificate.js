import { safeLogOut } from "../misc/userStatus";
import PositionCurricullums from "../pages/bpm/employeeRequest/positionCurricullums";
import PositionGears from "../pages/bpm/employeeRequest/positionGears";
import PositionGereralities from "../pages/bpm/employeeRequest/positionGereralities";
import PositionObservations from "../pages/bpm/employeeRequest/positionObservations";
import PositionRequirements from "../pages/bpm/employeeRequest/positionRequirements";
import PositionVehicle from "../pages/bpm/employeeRequest/positionVehicle";
import { getCase, getTask, getTaskName } from "./taskManagement";

const tabContents = [
  PositionGereralities,
  PositionVehicle,
  PositionRequirements,
  PositionGears,
  PositionObservations,
];

const tabTitles = [
  { label: "Datos del cargo", value: 0 },
  { label: "Vehiculo", value: 1 },
  { label: "Requerimientos", value: 2 },
  { label: "Equipo necesario", value: 3 },
  { label: "Observaciones", value: 4 },
];

async function request({ userName }) {
  return Meteor.callAsync(
    "simpleAcceptResponse",
    getTaskName(),
    userName,
    getCase(),
    getTask()
  ).catch((e) => {
    return e;
  });
}

export { tabTitles, tabContents, request };
