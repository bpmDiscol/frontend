import employeeRequestSchema from "./employeeRequestSchema";

export function validateEmployeeRequest(data) {
  try {
    employeeRequestSchema.parse(data);
  } catch (error) {
    return error;
  }
}
