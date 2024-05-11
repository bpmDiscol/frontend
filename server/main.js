import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

//auth
import "../imports/api/http/authentication";
//bpm data
import "../imports/api/bpmData/bpmMethods";

//userData
import "../imports/api/userData/userDataCollection";
import "../imports/api/userData/userDataMethods";
import "../imports/api/userData/userDataPublication";

Meteor.startup(async () => {});
