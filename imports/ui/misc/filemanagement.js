import {
  backgroundCollection,
  curricullumsCollection,
} from "../../api/files/filesCollection";

const collection = {
  background: backgroundCollection,
  curricullums: curricullumsCollection,
};

export function deleteFile(collectionId, _id) {
  collection[`${collectionId}`].remove({ _id });
}

export async function uploadFile(collectionId, fileData, callback, errCallback) {
  const collectionType = collection[`${collectionId}`];
  const upload = collectionType.insert(
    {
      file: fileData,
      chunkSize: "dynamic",
    },
    false
  );

  upload.on("uploaded", (error, fileObj) => {
    if (error) console.warn(error.reason);
    else {
      return callback(fileObj);
    }
  });
  upload.on('error', errCallback)
  upload.start();
}
