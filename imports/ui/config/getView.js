import React from "react";
import Dashboard from "../pages/dashboard";
import Loader from "../pages/loader";
import EmployeeRequestAdm from "../pages/bpm/employeeRequest/employeeRequestAdm";
import EmployeeRequestHR from "../pages/bpm/employeeRequest/employeeRequestHR";
import Tasks from "../components/tasks";
import Process from "../components/process";
import EmployeeRequestForm from "../pages/bpm/employeeRequest/employeeRequestForm";
import EmployeeRequestCurricullums from "../pages/bpm/employeeRequest/employeeRequestHRCurricullums";

import EmployeeRequestInterview from "../pages/bpm/employeeRequest/employeeRequestInterview";
import EmployeeRequestBackground from "../pages/bpm/employeeRequest/employeeRequestBackground";
import EmployeeCurricullumCheck from "../pages/bpm/employeeRequest/employeeCurricullumCheck";
import EmployeeUploadCVFiles from "../pages/bpm/employeeRequest/employeeUploadCVFiles";
import EmployeeHealthServiceResponse from "../pages/bpm/employeeRequest/employeeHealthServiceResponse";
import EmployeeHSEApprovation from "../pages/bpm/employeeRequest/employeeHSEApprovation";
import CredentialApp from "../pages/credentialApp";
import OtpAdmin from "../pages/otpAdmin";
import Notifications from "../pages/notifications";

export function getView(view) {
  const views = {
    dashboard: <Dashboard />,
    tasks: <Tasks />,
    process: <Process />,
    employee_request_form: <EmployeeRequestForm />,
    employee_request_adm: <EmployeeRequestAdm />,
    employee_request_hr: <EmployeeRequestHR />,
    load_curricullum: <EmployeeRequestCurricullums />,
    interview: <EmployeeRequestInterview />,
    legal_background: <EmployeeRequestBackground />,
    curricullum_check: <EmployeeCurricullumCheck />,
    upload_cv_files: <EmployeeUploadCVFiles />,
    healt_service_response: <EmployeeHealthServiceResponse />,
    hse_approvation: <EmployeeHSEApprovation />,
    credentials: <CredentialApp />,
    otpAdmin: <OtpAdmin />,
    notifications: <Notifications />
  };

  if (view in views) return views[view];
  return <Loader />;
}
