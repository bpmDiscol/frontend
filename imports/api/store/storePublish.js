import { Meteor } from "meteor/meteor";
import {
  buyOrdersCollections,
  productsCollection,
  stackCollections,
  storeRequestCollection,
} from "./storeCollection";

Meteor.publish("products", () => productsCollection.find().cursor);
Meteor.publish("stacks", () => stackCollections.find().cursor);
Meteor.publish("buyOrders", () => buyOrdersCollections.find().cursor);
Meteor.publish("storeRequests", () => storeRequestCollection.find().cursor);
