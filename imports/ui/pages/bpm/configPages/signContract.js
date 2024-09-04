import PositionEmployeeData from "../employeeRequest/positionEmployeeData";
import PositionGereralities from "../employeeRequest/positionGereralities";
import PositionObservations from "../employeeRequest/positionObservations";

const tabContents = [
  PositionGereralities,
  PositionObservations,
  PositionEmployeeData,
];

const tabTitles = [
  { label: "Datos del cargo", value: 0 },
  { label: "Observaciones", value: 1 },
  { label: "Documentos nomina", value: 2 },
];

const tabNumber = tabTitles.length - 1;

const subtitle = "Documentos finales";
const uploadNomina = true;

export { tabTitles, tabContents, tabNumber, subtitle, uploadNomina };
