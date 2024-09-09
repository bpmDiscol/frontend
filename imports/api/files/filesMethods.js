import { Meteor } from "meteor/meteor";
import {
  backgroundCollection,
  curricullumsCollection,
} from "./filesCollection";

const collection = {
  background: backgroundCollection,
  curricullums: curricullumsCollection,
};

function replaceBaseUrl(link) {
  return link.replace("http://localhost/", Meteor.absoluteUrl());
}

Meteor.methods({
  async getFileById(id, collectionId) {
    const collectionType = collection[`${collectionId}`];
    return await collectionType.find({ _id: id });
  },
  async getFileLink({ id, collectionName }) {
    return collection[`${collectionName}`].collection
      .find({}).fetch()
      .map(function (fileRef) {
        return {
          link: replaceBaseUrl(collection[`${collectionName}`].link(fileRef)),
          id: fileRef._id,
        };
      })
      .filter((dataLink) => dataLink.id == id);
  },
});
