import React from "react";

import loadable from '@loadable/component';
import { Spin } from 'antd';

const Dashboard = loadable(() => import("../pages/dashboard"), {
  fallback: <Spin fullscreen />,
});

const EmployeeRequestAdm = loadable(() => import("../pages/bpm/employeeRequest/employeeRequestAdm"), {
  fallback: <Spin fullscreen />,
});

const EmployeeRequestHR = loadable(() => import("../pages/bpm/employeeRequest/employeeRequestHR"), {
  fallback: <Spin fullscreen />,
});

const Tasks = loadable(() => import("../components/tasks"), {
  fallback: <Spin fullscreen />,
});

const Process = loadable(() => import("../components/process"), {
  fallback: <Spin fullscreen />,
});

const EmployeeRequestForm = loadable(() => import("../pages/bpm/employeeRequest/employeeRequestForm"), {
  fallback: <Spin fullscreen />,
});

const EmployeeRequestCurricullums = loadable(() => import("../pages/bpm/employeeRequest/employeeRequestHRCurricullums"), {
  fallback: <Spin fullscreen />,
});

const EmployeeRequestInterview = loadable(() => import("../pages/bpm/employeeRequest/employeeRequestInterview"), {
  fallback: <Spin fullscreen />,
});

const EmployeeRequestBackground = loadable(() => import("../pages/bpm/employeeRequest/employeeRequestBackground"), {
  fallback: <Spin fullscreen />,
});

const EmployeeCurricullumCheck = loadable(() => import("../pages/bpm/employeeRequest/employeeCurricullumCheck"), {
  fallback: <Spin fullscreen />,
});

const EmployeeUploadCVFiles = loadable(() => import("../pages/bpm/employeeRequest/employeeUploadCVFiles"), {
  fallback: <Spin fullscreen />,
});

const EmployeeHealthServiceResponse = loadable(() => import("../pages/bpm/employeeRequest/employeeHealthServiceResponse"), {
  fallback: <Spin fullscreen />,
});

const EmployeeHSEApprovation = loadable(() => import("../pages/bpm/employeeRequest/employeeHSEApprovation"), {
  fallback: <Spin fullscreen />,
});

const CredentialApp = loadable(() => import("../pages/credentialApp"), {
  fallback: <Spin fullscreen />,
});

const OtpAdmin = loadable(() => import("../pages/otpAdmin"), {
  fallback: <Spin fullscreen />,
});

const Notifications = loadable(() => import("../pages/notifications"), {
  fallback: <Spin fullscreen />,
});

const EmployeeRequestResponse = loadable(() => import("../pages/bpm/employeeRequest/employeeRequestResponse"), {
  fallback: <Spin fullscreen />,
});

const generateInduction = loadable(() => import("../pages/bpm/configPages/generateInduction"), {
  fallback: <Spin fullscreen />,
});

const biometricRegistry = loadable(() => import("../pages/bpm/configPages/biometricRegistry"), {
  fallback: <Spin fullscreen />,
});

const watchRut = loadable(() => import("../pages/bpm/configPages/watchRUT"), {
  fallback: <Spin fullscreen />,
});

const socialSecurity = loadable(() => import("../pages/bpm/configPages/socialSecurity"), {
  fallback: <Spin fullscreen />,
});

const bankCertificate = loadable(() => import("../pages/bpm/configPages/bankCertificate"), {
  fallback: <Spin fullscreen />,
});

const nominaBase = loadable(() => import("../pages/bpm/configPages/nominaBase"), {
  fallback: <Spin fullscreen />,
});

const gearsAuth = loadable(() => import("../pages/bpm/configPages/gearsAuth"), {
  fallback: <Spin fullscreen />,
});

const salaryValidation = loadable(() => import("../pages/bpm/configPages/salaryValidation"), {
  fallback: <Spin fullscreen />,
});

const RequestEmployeeSearch = loadable(() => import("../pages/requestEmployeeSearch"), {
  fallback: <Spin fullscreen />,
});

export {
  Dashboard,
  EmployeeRequestAdm,
  EmployeeRequestHR,
  Tasks,
  Process,
  EmployeeRequestForm,
  EmployeeRequestCurricullums,
  EmployeeRequestInterview,
  EmployeeRequestBackground,
  EmployeeCurricullumCheck,
  EmployeeUploadCVFiles,
  EmployeeHealthServiceResponse,
  EmployeeHSEApprovation,
  CredentialApp,
  OtpAdmin,
  Notifications,
  EmployeeRequestResponse,
  generateInduction,
  biometricRegistry,
  watchRut,
  socialSecurity,
  bankCertificate,
  nominaBase,
  gearsAuth,
  salaryValidation,
  RequestEmployeeSearch
};
