import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { Flex, Typography } from "antd";

export default function UploadFile({ title, targetField }) {
  const { Title } = Typography;
  let currentFile;
  function response(fieldId, fileId, index) {
    currentFile = fileId;
    console.log({ fieldId, fileId, index });
  }
  return (
    <Flex>
      <Title>{title}</Title>
      <Upload
        maxCount={1}
        beforeUpload={(file) => {
          console.log(currentFile);
          if (currentFile) deleteFile("background", currentFile);
          uploadFile("background", file, 0, response);
        }}
        action={`${Meteor.absoluteUrl("/")}post`}
      >
        Load file
      </Upload>
    </Flex>
  );
}
