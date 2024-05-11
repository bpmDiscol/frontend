import { Meteor } from "meteor/meteor";
import { AuthenticationCollection } from "./authenticationCollection";

Meteor.publish("authentication", function () {
  return AuthenticationCollection.find({});
});