import { Meteor } from "meteor/meteor";
import { requestEmployeeCollection } from "./requestEmployeeDataPublication";

Meteor.publish("requestEmployee", function () {
  return requestEmployeeCollection.find({});
});
