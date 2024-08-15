import { Meteor } from "meteor/meteor";
import { providersCollection } from "./providersCollection";

Meteor.publish("providers", () => providersCollection.find().cursor);
