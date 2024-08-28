import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

//auth
import "../imports/api/http/authentication";
//bpm data
import "../imports/api/bpmData/bpmMethods";
import "../imports/api/bpmData/employeeRequestMethods";

//userData
import "../imports/api/userData/userDataCollection";
import "../imports/api/userData/userDataMethods";
import "../imports/api/userData/userDataPublication";

//collections
import "../imports/api/curricullums/curricullumCollection";
import "../imports/api/curricullums/curricullumMethods";
import "../imports/api/curricullums/curricullumsPublication";

import "../imports/api/requestEmployeData/requestEmployeeDataCollection";
import "../imports/api/requestEmployeData/requestEmployeeDataPublication";
import "../imports/api/requestEmployeData/requestEmployeeMethods";

//files
import "../imports/api/files/filesCollection";
import "../imports/api/files/filesMethods";
import "../imports/api/files/filesPublication";

//blackList
import "../imports/api/blackList/blackListCollection";
import "../imports/api/blackList/blackListMethods";
import "../imports/api/blackList/blackListPublications";

//alerts
import "../imports/api/alerts/alertMessages";
import "../imports/api/alerts/alertsCollection";
import "../imports/api/alerts/alertsMethods";
import "../imports/api/alerts/alertsPublications";

//sql
import "../imports/api/bdmData/bdmMethods";

Accounts.config({
  //cierra la sesion inactiva de 8 horas
  loginExpirationInDays: 8 / 24,
});

Meteor.methods({
  sendEmail({ to, from, subject, text, html }) {
    this.unblock();
    Email.send({ to, from, subject, text, html });
  },
});

Meteor.startup(async () => {
  //elimina las alertas viejas(+48 horas) cada hora
  Meteor.setInterval(() => Meteor.call("deleteOldAlerts", 48), 1000 * 60 * 60);
  // console.log(JSON.stringify(process.env.MAIL_URL));
});
