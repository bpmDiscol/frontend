import { Meteor } from "meteor/meteor";
import { providersCollection } from "./providersCollection";
import { getPagination } from "../misc/agregation";

Meteor.methods({
  createProvider(provider) {
    const {
      name, //necesaria
      NIT,
      cedula,
      description,
      certCamaraComercio,
      RUT, //necesaria
      bankAccount, //necesaria
    } = provider;

    return providersCollection.insert({
      name,
      NIT,
      cedula,
      description,
      certCamaraComercio,
      RUT,
      bankAccount,
      createdAt: Date.now(),
    });
  },
  updateProvider(product) {
    const { _id, ...updatedData } = product;
    return providersCollection.update(
      product._id,
      { ...updatedData, updatedAt: Date.now() },
      {
        upsert: true,
      }
    );
  },
  getProvider(id) {
    return providersCollection.findOne(id);
  },
  getAllProviders({ page, pageSize }) {
    const pagination = getPagination(page, pageSize);
    const products = providersCollection
      .rawCollection()
      .aggregate([...pagination])
      .toArray();
    return products;
  },
});
