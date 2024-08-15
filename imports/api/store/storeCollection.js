import { Mongo } from "meteor/mongo";

export const productsCollection = new Mongo.Collection("products");
export const stackCollections = new Mongo.Collection("stacks");
export const buyOrdersCollections = new Mongo.Collection("buyOrders");
export const storeRequestCollection = new Mongo.Collection("storeRequests")
