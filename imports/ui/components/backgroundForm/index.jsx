import { Upload } from "antd";
import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";

export default function BackgroundForm() {
  let currentFile;

  function response(fieldId, fileId, index) {
   
    currentFile = fileId;
    console.log({ fieldId, fileId, index });
  }

  return (
    <div>
      <Upload
        maxCount={1}
        beforeUpload={(file) => {
            console.log(currentFile)
          if (currentFile) deleteFile("background", currentFile);
          uploadFile("background", file, 0, response);
        }}
        action={`${Meteor.absoluteUrl("/")}post`}
      >
        Load file
      </Upload>
    </div>
  );
}
