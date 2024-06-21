import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { Upload, Typography, Flex } from "antd";
import { getTask, getTaskName } from "../../config/taskManagement";

export default function UploadFile({
  title,
  id,
  targetField,
  currentBackground,
  setCurrentBackground,
  taskId,
}) {
  const { Title } = Typography;
  const currentFile = Object.keys(currentBackground).includes(targetField)
    ? currentBackground[`${targetField}`]
    : null;

  function setNewBackground(value) {
    const newBg = Object.assign(currentBackground, {
      [`${targetField}`]: value,
    });
    setCurrentBackground(newBg);
    Meteor.callAsync("update_backgrounds", {
      taskId,
      id,
      backgroundFiles: newBg,
    }).catch((error) => console.log(error));
  }
  return (
    <Flex vertical>
      <Title level={3}>{title}</Title>
      <Upload
        defaultFileList={currentFile?[
          {
            uid: currentFile?._id,
            name: currentFile?.name,
            status: "done",
          },
        ]:[]}
        onRemove={(currentFile) => {
          //TODO: remover data del estado
          deleteFile("background", currentFile.uid);
          setNewBackground(null)
        }}
        maxCount={1}
        beforeUpload={(file) => {
          if (currentFile) deleteFile("background", currentFile._id);
          uploadFile("background", file, ({ _id, name }) => {
            setNewBackground({ _id, name });
          });

          return false;
        }}
        // action={`${Meteor.absoluteUrl("/")}post`}
      >
        Load file
      </Upload>
    </Flex>
  );
}
