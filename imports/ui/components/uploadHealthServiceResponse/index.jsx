import { CheckOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";

export default function UploadHealthResponse({
  targetField,
  currentHealthResponses,
  setCurrentHealthResponses,
  id,
}) {
  const [files, setFiles] = React.useState();
  const currentFile = Object.keys(currentHealthResponses || {}).includes(id)
    ? currentHealthResponses[`${id}`]
    : null;
  React.useEffect(() => {
    setFiles(
      currentFile
        ? [
            {
              uid: currentFile?._id,
              name: currentFile?.name,
              status: "done",
            },
          ]
        : []
    );
  }, [currentFile]);

  function remove(file) {
    deleteFile("background", file.uid);
    setCurrentHealthResponses(null, targetField, id);
  }

  function upload(file) {
    if (currentFile) deleteFile("background", currentFile._id);
    uploadFile("background", file, ({ _id, name }) => {
      setCurrentHealthResponses({ _id, name }, targetField, id);
      console.log("uploading...");
    });

    return false;
  }

  return (
    <Upload
      maxCount={1}
      onRemove={remove}
      beforeUpload={upload}
      fileList={files}
      // action={`${Meteor.absoluteUrl("/")}post`}
    >
      <Button
        style={{
          backgroundColor: currentFile ? "green" : "dimgray",
          width: "10rem",
        }}
        icon={
          currentFile ? (
            <CheckOutlined style={{ fontSize: "18px" }} />
          ) : (
            <UploadOutlined style={{ fontSize: "18px" }} />
          )
        }
        iconPosition="end"
        type="primary"
      >
        {currentFile ? "Cargado" : " Cargar archivo"}
      </Button>
    </Upload>
  );
}
