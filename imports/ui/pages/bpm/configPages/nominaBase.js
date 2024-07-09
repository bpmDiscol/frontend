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
  background: [{ title: "Certificado bancario", linkId: "certificado_banco" }],
};

export { tabTitles, tabContents, request, tabNumber, buttons };

// nombre cedula cuenta y area de trabajo