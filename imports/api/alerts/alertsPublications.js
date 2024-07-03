import { Meteor } from "meteor/meteor";
import { AlertsCollection } from "./alertsCollection";

Meteor.publish("alerts", function () {
  return AlertsCollection.find({});
});