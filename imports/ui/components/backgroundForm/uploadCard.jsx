import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { Upload, Typography, Flex } from "antd";


export default function UploadFile({ title, targetField }) {
  const { Title } = Typography;
  let currentFile;
  function response(fieldId, fileId, index) {
    currentFile = fileId;
    console.log({ fieldId, fileId, index });
  }
  return (
    <Flex vertical>
      <Title level={3}>{title}</Title>
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
