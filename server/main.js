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

Meteor.startup(async () => {});
