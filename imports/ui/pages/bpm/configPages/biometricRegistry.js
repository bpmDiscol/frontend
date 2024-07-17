import PositionEmployeeData from "../employeeRequest/positionEmployeeData";
import PositionGears from "../employeeRequest/positionGears";

const tabContents = [PositionEmployeeData, PositionGears];

const tabTitles = [{ label: "Registros Biométricos", value: 0 }];

const tabNumber = tabTitles.length - 1;

const buttons = {};

export { tabTitles, tabContents, request, tabNumber, buttons };
