import { Meteor } from "meteor/meteor";
import {
  buyOrdersCollections,
  productsCollection,
  stackCollections,
  storeRequestCollection,
} from "./storeCollection";
import {
  getArrayLookup,
  getPagination,
  getSimpleLookup,
} from "../misc/agregation";

Meteor.methods({
  //#region  products
  createProduct(product) {
    const { name, price, description, code } = product;
    return productsCollection.insert({ name, price, description, code });
  },
  updateProduct(product) {
    const { _id, ...updatedData } = product;
    return productsCollection.update(product._id, updatedData, {
      upsert: true,
    });
  },
  getProduct(id) {
    return productsCollection.findOne(id);
  },
  getAllProducts({ page, pageSize }) {
    const pagination = getPagination(page, pageSize);
    const products = stackCollections
      .rawCollection()
      .aggregate([...pagination])
      .toArray();
    return products;
  },
  removeProduct(id) {
    return productsCollection.remove(id);
  },
  //#endregion
  //#region stacks
  createStack(stack) {
    const { product, quantity, provider, description } = stack;
    return stackCollections.insert({
      product,
      quantity,
      provider,
      description,
    });
  },
  updateStack(stack) {
    const { _id, ...updatedData } = stack;
    return stackCollections.update(product._id, updatedData, {
      upsert: true,
    });
  },
  getStack(id) {
    const lookup = getSimpleLookup("products", "product", "_id");
    const stack = stackCollections
      .rawCollection()
      .aggregate([{ $match: { _id: id } }, ...lookup])
      .toArray();
    return stack;
  },
  getAllStacks({ page, pageSize }) {
    const lookup = getSimpleLookup("products", "product", "_id");
    const pagination = getPagination(page, pageSize);
    const stacks = stackCollections
      .rawCollection()
      .aggregate([...lookup, ...pagination])
      .toArray();
    return stacks;
  },
  removeStack(id) {
    return productsCollection.remove(id);
  },

  //#endregion
  //#region buy orders
  createBuyOrder(order) {
    const {
      orderId,
      status,
      value,
      deliveryDate,
      stock, //conjunto de stacks
    } = order;

    return buyOrdersCollections.insert({
      orderId,
      status,
      value,
      deliveryDate,
      stock, //conjunto de stacks
      createdAt: Date.now(),
    });
  },
  updateBuyOrder(order) {
    const { _id, ...updatedData } = order;
    return buyOrdersCollections.update(
      product._id,
      { ...updatedData, updatedAt: Date.now() },
      {
        upsert: true,
      }
    );
  },
  getBuyOrder(id) {
    const lookup = getArrayLookup("stacks", "stock", "_id");
    const buyOrder = buyOrdersCollections
      .rawCollection()
      .aggregate([{ $match: { _id: id } }, ...lookup])
      .toArray();
    return buyOrder;
  },
  getBuyOrders({ page, pageSize }) {
    const lookup = getArrayLookup("stacks", "stock", "_id");
    const pagination = getPagination(page, pageSize);

    const buyOrders = buyOrdersCollections
      .rawCollection()
      .aggregate([...lookup, ...pagination])
      .toArray();

    return buyOrders;
  },
  removeBuyOrder(id) {
    return productsCollection.remove(id);
  },
  //#endregion
  //#region
  createRequest(request) {
    const { requester, status, startDate, endDate, requesteditems, notes } =
      request;

    return storeRequestCollection.insert({
      requester,
      status,
      startDate,
      endDate,
      requesteditems,
      notes,
      createdAt: Date.now(),
    });
  },
  updateRequest(request) {
    const { _id, ...updatedData } = request;
    return storeRequestCollection.update(
      product._id,
      { ...updatedData, updatedAt: Date.now() },
      {
        upsert: true,
      }
    );
  },
  getRequest(id) {
    const lookup = getArrayLookup("stacks", "stock", "_id");
    const buyOrder = buyOrdersCollections
      .rawCollection()
      .aggregate([{ $match: { _id: id } }, ...lookup])
      .toArray();
    return buyOrder;
  },
  getAllRequests() {
    const lookup = getArrayLookup("stacks", "stock", "_id");
    const pagination = getPagination(page, pageSize);

    const requests = buyOrdersCollections
      .rawCollection()
      .aggregate([...lookup, ...pagination])
      .toArray();
    return requests;
  },
  removeRequest(id) {
    return productsCollection.remove(id);
  },
  //#endregion
});
