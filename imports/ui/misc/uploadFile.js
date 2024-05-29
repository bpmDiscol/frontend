import { curricullumCollection } from "../../api/curricullums/curricullumCollection";

export function uploadFile(fileData, index = 0, callback) {
  const upload = curricullumCollection.insert(
    {
      file: fileData,
      chunkSize: "dynamic",
    },
    false
  );

  upload.on("start", function () {
    console.log("cargando archivo...");
  });

  upload.on("end", (error, fileObj) => {
    if (!error) {
      callback("fileId", fileObj._id, index);
      //   responseFn("Archivo cargado con exito", "success");
    }
  });
  upload.start();
}
