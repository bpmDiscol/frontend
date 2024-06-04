import { employeeRequestSchema } from "./employeeRequestSchema";

export function validateEmployeeRequest(data) {
  try {
    employeeRequestSchema.parse(data);
    return "OK";
  } catch (error) {
    return error;
  }
}
