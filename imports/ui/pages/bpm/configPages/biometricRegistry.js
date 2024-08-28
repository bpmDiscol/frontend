import PositionEmployeeData from "../employeeRequest/positionEmployeeData";
import PositionGears from "../employeeRequest/positionGears";

const tabContents = [PositionEmployeeData, PositionGears];

const tabTitles = [
  { label: "Registros Biométricos", value: 0 },
  { label: "Equipo necesario", value: 1 },
];

const tabNumber = 0;

const buttons = {};
const subtitle = "Registro biometrico y equipos"


export { tabTitles, tabContents, request, tabNumber, buttons, subtitle };
