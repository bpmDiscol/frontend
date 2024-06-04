import { z as zod } from "zod";

function isStringValid(value) {
  return value.length > 0;
}
function isnumberValid(value) {
    return value !== 0;
  }

const timeExtension = zod.object({
  cuantity: zod.number().refine(isnumberValid),
  timePart: zod.string().refine(isStringValid),
});

const workingDay = zod.object({
  isFullTime: zod.boolean(),
  isPartTime: zod.boolean(),
  isDayTime: zod.boolean(),
});
const motive = zod.object({
  isNewCharge: zod.boolean(),
  isEmployeeExpanding: zod.boolean(),
  isLicence: zod.boolean(),
  isNewProject: zod.boolean(),
  isReplacement: zod.boolean(),
  isEmployeeInhability: zod.boolean(),
});
const contractType = zod.object({
  isContractedLabor: zod.boolean(),
  isUndefined: zod.boolean(),
  isFixedTerm: zod.boolean(),
  isLearning: zod.boolean(),
});

const requestEmployeeData = zod.object({
  site: zod.string().refine(isStringValid),
  companyPosition: zod.string().refine(isStringValid),
  area_proyect: zod.string().refine(isStringValid),
  isHandbookFunction: zod.boolean(),
  workPlace: zod.string().refine(isStringValid),
  vacancies: zod.number(),
  duration: timeExtension,
  salary: zod.number().refine(isnumberValid),
  isBonus: zod.boolean(),
  bonusesFrecuency: timeExtension,
  isVehicle: zod.boolean(),
  vehicleType: zod.string(),
  licenceType: zod.string(),
  bearingValue: zod.number(),
  workingDay: workingDay,
  motive: motive,
  contractType: contractType,
  requirements: zod.string(),
  observations: zod.array(zod.string()),
});

export default zod.object({
  contractType: zod.string(),
  workingDayType: zod.string(),
  motive: zod.string(),
  requestEmployeeDataInput: requestEmployeeData,
});
