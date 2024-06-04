import { z, z as zod } from "zod";

const requestEmployeeData = zod.object({
  site: zod.string(),
  companyPosition: zod.string(),
  area_proyect: zod.string(),
  isHandbookFunction: zod.boolean(),
  workPlace: zod.string(),
  vacancies: zod.number(),
  duration: timeExtension,
  salary: zod.number(),
  isBonus: zod.boolean(),
  bonusesFrecuency: timeExtension,
  isVehicle: zod.boolean(),
  vehicleTyoe: zod.string(),
  licenceType: zod.string(),
  bearingValue: zod.number(),
  workingDay: workingDay,
  motive: motive,
  contractType: contractType,
});

const timeExtension = zod.object({
  cuantity: zod.number(),
  timePart: zod.string(),
});

const workingDay = zod.object({
  isFullTime: Zod.boolean(),
  isPartTime: Zod.boolean(),
  isDayTime: Zod.boolean(),
});
const motive = {
  isNewCharge: Zod.boolean(),
  isEmployeeExpanding: Zod.boolean(),
  isLicence: Zod.boolean(),
  isNewProject: Zod.boolean(),
  isReplacement: Zod.boolean(),
  isEmployeeInhability: Zod.boolean(),
};
const contractType = {
  isContractedLabor: Zod.boolean(),
  isUndefined: Zod.boolean(),
  isFixedTerm: Zod.boolean(),
  isLearning: Zod.boolean(),
};

const gears = zod.object({});

export const schema = zod.object({
  constractType: zod.string(),
  workingDayType: zod.string(),
  motive: zod.string(),
  requestEmployeeDataInput: requestEmployeeData,
  gears: gears,
  requirements: zod.string(),
  observations: zod.string,
});
