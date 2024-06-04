import {z as zod } from "zod";

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
  isFullTime: zod.boolean(),
  isPartTime: zod.boolean(),
  isDayTime: zod.boolean(),
});
const motive = {
  isNewCharge: zod.boolean(),
  isEmployeeExpanding: zod.boolean(),
  isLicence: zod.boolean(),
  isNewProject: zod.boolean(),
  isReplacement: zod.boolean(),
  isEmployeeInhability: zod.boolean(),
};
const contractType = {
  isContractedLabor: zod.boolean(),
  isUndefined: zod.boolean(),
  isFixedTerm: zod.boolean(),
  isLearning: zod.boolean(),
};

export const employeeRequestSchema = zod.object({
  constractType: zod.string(),
  workingDayType: zod.string(),
  motive: zod.string(),
  requestEmployeeDataInput: requestEmployeeData,
  gears: zod.optional(),
  requirements: zod.string(),
  observations: zod.string(),
});
