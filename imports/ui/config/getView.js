import React from "react";
import loadables from "./loadables";
import Loader from "../pages/loader";

import base from "../pages/bpm/configPages/nominaBase";
import bank_certificate from "../pages/bpm/configPages/bankCertificate";
import biometric_registry from "../pages/bpm/configPages/biometricRegistry";
import gears_auth from "../pages/bpm/configPages/gearsAuth";
import generate_induction from "../pages/bpm/configPages/generateInduction";
import salary_validation from "../pages/bpm/configPages/salaryValidation";
import simpleRequest from "../pages/bpm/configPages/simpleRequest";
import activate_social_security from "../pages/bpm/configPages/socialSecurity";
import RUT from "../pages/bpm/configPages/watchRUT";

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
  logistica: "Logistica",
  inventory: "Inventory",
  providers: "Providers",
  logisticRequest: "LogisticRequest",
};

const properties = {
  base,
  activate_social_security,
  employee_request_search: simpleRequest,
  sign_contract: simpleRequest,
  bank_certificate,
  biometric_registry,
  gears_auth,
  RUT,
  generate_induction,
  salary_validation,
};

export function getView(view) {
  const Component = loadables[viewMappings[view]];

  if (!Component) {
    return <Loader />;
  }

  return <Component {...properties[view]} />;
}
