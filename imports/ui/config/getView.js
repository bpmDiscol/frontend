import React from "react";
import Dashboard from "../pages/dashboard";
import Process from "../pages/process";
import Tasks from "../pages/tasks";
import Loader from "../pages/loader";
import EmployeeRequestPreview from "../pages/bpm/employeeRequest/employeeRequest-preview";
import InterviewPreview from "../pages/bpm/interview-preview";
import EmployeeRequestAdm from "../pages/bpm/employeeRequest/employeeRequestAdm";

export function getView(view, params = {}) {
  const user = Meteor.users.findOne(Meteor.userId({}));
  console.log(params)

  const views = {
    dashboard: <Dashboard bonitaUserId={user.profile.bonitaUser} />,
    process: <Process bonitaUserId={user.profile.bonitaUser} />,
    tasks: <Tasks bonitaUserId={user.profile.bonitaUser} />,
    "Solicitud de Personal": (
      <EmployeeRequestPreview
        taskId={params.taskId}
        userId={user.profile.bonitaUser}
      />
    ),
    Entrevista: <InterviewPreview />,
    employee_request_adm_preview: (
      <EmployeeRequestPreview
        taskId={params.taskId}
        userId={user.profile.bonitaUser}
      />
    ),
    employee_request_adm: (
      <EmployeeRequestAdm
        taskId={params.taskId}
        userId={user.profile.bonitaUser}
      />
    ),
  };

  if (view in views) return views[view];
  return <Loader />;
}
