import PositionEmployeeData from "../employeeRequest/positionEmployeeData";

const tabContents = [PositionEmployeeData];

const tabTitles = [{ label: "Nuevos empleados", value: 0 }];

const tabNumber = tabTitles.length - 1;

const buttons = {
  background: [{ title: "Certificado bancario", linkId: "certificado_banco" }],
};

export { tabTitles, tabContents, request, tabNumber, buttons };
