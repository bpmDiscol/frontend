import React from "react";
import loadables from "./loadables";
import Loader from "../pages/loader";

const viewMappings = {
  dashboard: "Dashboard",
  tasks: "Tasks",
  process: "Process",
  employee_request_form: "EmployeeRequestForm",
  employee_request_adm: "EmployeeRequestAdm",
  employee_request_dir_cartera: "EmployeeRequestAdm",
  employee_request_dir_scr: "EmployeeRequestAdm",
  employee_request_hr: "EmployeeRequestHR",
  load_curricullum: "EmployeeRequestCurricullums",
  interview: "EmployeeRequestInterview",
  legal_background: "EmployeeRequestBackground",
  curricullum_check: "EmployeeCurricullumCheck",
  upload_cv_files: "EmployeeUploadCVFiles",
  healt_service_response: "EmployeeHealthServiceResponse",
  hse_approvation: "EmployeeHSEApprovation",
  credentials: "CredentialApp",
  otpAdmin: "OtpAdmin",
  notifications: "Notifications",
  employee_request_response: "EmployeeRequestResponse",
  generate_induction: "EmployeeRequestResponse",
  activate_social_security: "EmployeeRequestResponse",
  gears_auth: "EmployeeRequestResponse",
  biometric_registry: "EmployeeRequestResponse",
  RUT: "EmployeeRequestResponse",
  bank_certificate: "EmployeeRequestResponse",
  base: "EmployeeRequestResponse",
  sign_contract: "EmployeeRequestResponse",
  salary_validation: "EmployeeRequestResponse",
  employee_request_search: "RequestEmployeeSearch",
};

export function getView(view) {
  const Component = loadables[viewMappings[view]];

  if (!Component) {
    return <Loader />;
  }

  return <Component />;
}
