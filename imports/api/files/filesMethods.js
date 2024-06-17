import { Meteor } from "meteor/meteor";
import {
  backgroundCollection,
  curricullumsCollection,
} from "./filesCollection";
import { curricullumCollection } from "../curricullums/curricullumCollection";

const collection = {
  background: backgroundCollection,
  curricullums: curricullumsCollection,
  curricullum: curricullumCollection,
};

Meteor.methods({
  async getFileById(id, collectionId) {
    const collectionType = collection[`${collectionId}`];
    return await collectionType.find({ _id: id });
  },
  async getFileLink({ id, collectionName }) {
    return collection[`${collectionName}`].collection
      .find({})
      .map(function (fileRef) {
        console.log("🚀 ~ fileRef:", fileRef)
        
        return {
          link: collection[`${collectionName}`].link(fileRef),
          id: fileRef._id,
        };
      })
      .filter((dataLink) => dataLink.id == id);
  },
});
