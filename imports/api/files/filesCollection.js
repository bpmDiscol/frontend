import { FilesCollection } from "meteor/ostrio:files";

export const backgroundCollection = new FilesCollection({
  collectionName: "backgroundFiles",
});

export const curricullumsCollection = new FilesCollection({
    collectionName: "curricullums",
  });
  