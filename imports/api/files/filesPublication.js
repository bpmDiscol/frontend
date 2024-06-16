import { Meteor } from "meteor/meteor";
import { backgroundCollection, curricullumsCollection } from "./filesCollection";

Meteor.publish("backgroundFiles", function () {
  return backgroundCollection.find({}).cursor;
});

Meteor.publish("curricullums", function () {
    return curricullumsCollection.find({}).cursor;
  });