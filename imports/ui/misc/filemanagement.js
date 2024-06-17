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

export async function uploadFile(collectionId, fileData, index, callback) {
  console.log(collectionId);
  const collectionType = collection[`${collectionId}`];
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
      return callback(fileObj._id);
    }
  });
  upload.start();
}



