import { Meteor } from "meteor/meteor";
import { curricullumCollection } from "./curricullumCollection";

Meteor.publish("curricullums", function () {
  return curricullumCollection.find({}).cursor;
});