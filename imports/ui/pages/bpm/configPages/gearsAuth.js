import PositionEmployeeData from "../employeeRequest/positionEmployeeData";
import PositionGears from "../employeeRequest/positionGears";

const tabContents = [
  PositionEmployeeData,
  PositionGears,
];

const tabTitles = [
  { label: "Nuevos empleados", value: 0 },
  { label: "Equipo necesario", value: 1 },
];

const tabNumber = tabTitles.length - 1;

const buttons = {
};
const subtitle = "Autorización de equipos"

export { tabTitles, tabContents, tabNumber, buttons, subtitle };
