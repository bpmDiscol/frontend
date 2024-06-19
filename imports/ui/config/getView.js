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

export function getView(view, params = {}) {
  const user = Meteor.users.findOne(Meteor.userId({}));

  const views = {
    dashboard: <Dashboard bonitaUserId={user?.profile?.bonitaUser} />,
    tasks: <Tasks bonitaUserId={user?.profile?.bonitaUser} />,
    process: <Process bonitaUserId={user?.profile?.bonitaUser} />,
    employee_request_form: (
      <EmployeeRequestForm bonitaUserId={user?.profile?.bonitaUser} />
    ),
    employee_request_adm: <EmployeeRequestAdm caseId={params.caseId} />,
    employee_request_hr: <EmployeeRequestHR caseId={params.caseId} />,
    load_curricullum: <EmployeeRequestCurricullums caseId={params.caseId} />,
    interview: <EmployeeRequestInterview caseId={params.caseId} />,
    legal_background: <EmployeeRequestBackground caseId={params.caseId} />,
  };

  if (view in views) return views[view];
  return <Loader />;
}
