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
  { label: "Nuevos empleados", value: 2 },
];

const tabNumber = tabTitles.length - 1;
const salary = true;

const buttons = {
  curricullum: true,
};

const subtitle = "validación de salarios"

export { tabTitles, tabContents, tabNumber, buttons, salary, subtitle };
