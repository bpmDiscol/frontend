import { FilesCollection } from "meteor/ostrio:files";

export const backgroundCollection = new FilesCollection({
  collectionName: "backgroundFiles",
  storagePath: "/data"
});

export const curricullumsCollection = new FilesCollection({
    collectionName: "curricullums",
    storagePath: "/data"

  });
  