import { Meteor } from "meteor/meteor";
import { curricullumCollection } from "./curricullumCollection";

Meteor.publish("curricullum", function () {
  return curricullumCollection.find({}).cursor;
});