import PositionEmployeeData from "../employeeRequest/positionEmployeeData";
import PositionGears from "../employeeRequest/positionGears";

const tabContents = [PositionEmployeeData, PositionGears];

const tabTitles = [
  { label: "Registros Biométricos", value: 0 },
  { label: "Equipo necesario", value: 1 },
];

const tabNumber = 0;

const buttons = {};

export { tabTitles, tabContents, request, tabNumber, buttons };
