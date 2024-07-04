import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'


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

Accounts.config({
    loginExpirationInDays: 0.5
})

Meteor.startup(async () => {});
