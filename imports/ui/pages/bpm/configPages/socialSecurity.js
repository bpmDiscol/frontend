import PositionEmployeeData from "../employeeRequest/positionEmployeeData";

const tabContents = [PositionEmployeeData];

const tabTitles = [{ label: "Nuevos empleados", value: 0 }];

const tabNumber = tabTitles.length - 1;

const buttons = {
  background: [
    { title: "Cert. EPS", linkId: "certificado_eps" },
    { title: "Cert. ARL", linkId: "certificado_arl" },
    { title: "Cert. Pensiones", linkId: "certificado_pensiones" },
  ],
};
const subtitle = "Seguridad social";

export { tabTitles, tabContents, tabNumber, buttons, subtitle };
