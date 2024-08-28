import PositionEmployeeData from "../employeeRequest/positionEmployeeData";

const tabContents = [PositionEmployeeData];

const tabTitles = [{ label: "Nuevos empleados", value: 0 }];

const tabNumber = tabTitles.length - 1;

const buttons = {
  background: [{ title: "Descargar RUT", linkId: "certificado_rut" }],
};

const subtitle = "RUT"

export { tabTitles, tabContents, tabNumber, buttons, subtitle };
