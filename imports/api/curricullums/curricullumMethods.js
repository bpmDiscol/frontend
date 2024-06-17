import { Meteor } from "meteor/meteor";
import { curricullumCollection } from "./curricullumCollection.js";

Meteor.methods({
  upload_file(fileData) {
    console.log("upload file: " + fileData);
    return Meteor.call("post_data", {
      url: "/API/formFileUpload",
      data: fileData,
    });
  },
  async get_curricullum_by_id({ id }) {
    return await curricullumCollection.find({ _id: id });
  },
  
  get_file_link({ id }) {
    console.log(curricullumCollection)
    return curricullumCollection.collection
      .find({})
      .map(function (fileRef) {
        return { link: curricullumCollection.link(fileRef), id: fileRef._id };
      })
      .filter((dataLink) => dataLink.id == id);
  },
  delete_file({ fileId }) {
    curricullumCollection.remove({ _id: fileId });
  },
});
