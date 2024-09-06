import PositionEmployeeData from "../employeeRequest/positionEmployeeData";
import PositionGereralities from "../employeeRequest/positionGereralities";
import PositionObservations from "../employeeRequest/positionObservations";
import PositionVehicle from "../employeeRequest/positionVehicle";

const tabContents = [
  PositionGereralities,
  PositionVehicle,
  PositionObservations,
  PositionEmployeeData,
];

const tabTitles = [
  { label: "Datos del cargo", value: 0 },
  { label: "Vehiculo", value: 1 },
  { label: "Observaciones", value: 2 },
  { label: "Nuevos empleados", value: 3 },
];

const tabNumber = tabTitles.length - 1;

const buttons = {
  background: [
    { title: "EPS", linkId: "certificado_eps" },
    { title: "ARL", linkId: "certificado_arl" },
    { title: "Pensiones", linkId: "certificado_pensiones" },
    { title: "Bancario", linkId: "certificado_banco" },
    { title: "Cedula", linkId: "cedula" },
  ],
  curricullum: true,
};
const showSalary = true;

const subtitle = "Base de nómina";

export {
  tabTitles,
  tabContents,
  request,
  tabNumber,
  buttons,
  showSalary,
  subtitle,
};
