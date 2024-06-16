import {
  backgroundCollection,
  curricullumsCollection,
} from "../../api/files/filesCollection";

const collection = {
  background: backgroundCollection,
  curricullums: curricullumsCollection,
};

export function deleteFile(name, _id) {
    console.log(_id)
  collection[`${name}`].collection.remove({ _id });
}

export function uploadFile(name, fileData, index, callback) {
  console.log(name);
  const collectionType = collection[`${name}`];
  const upload = collectionType.insert(
    {
      file: fileData,
      chunkSize: "dynamic",
    },
    false
  );

  upload.on("end", (error, fileObj) => {
    if (error) console.log(error);
    else {
      callback("fileId", fileObj._id, index);
    }
  });
  upload.start();
}
