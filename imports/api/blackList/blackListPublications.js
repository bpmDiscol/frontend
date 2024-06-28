import { Meteor } from "meteor/meteor";
import { BlackListCollection } from "./blackListCollection";

Meteor.publish("blackList", function () {
  return BlackListCollection.find({});
});