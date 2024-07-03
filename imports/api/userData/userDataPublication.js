import { Meteor } from "meteor/meteor";

Meteor.publish("userData", function () {
  return Meteor.users.find({}, {fields:{services:{twoFactorAuthentication:1}, username:1}});
});
