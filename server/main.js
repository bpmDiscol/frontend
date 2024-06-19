import { Meteor } from "meteor/meteor";

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
import "../imports/api/curricullums/curricullumCollection"
import "../imports/api/curricullums/curricullumMethods"
import "../imports/api/curricullums/curricullumsPublication"

import "../imports/api/requestEmployeData/requestEmployeeDataCollection"
import "../imports/api/requestEmployeData/requestEmployeeDataPublication"
import "../imports/api/requestEmployeData/requestEmployeeMethods"

//files
import "../imports/api/files/filesCollection"
import "../imports/api/files/filesMethods"
import "../imports/api/files/filesPublication"



Meteor.startup(async () => {});
