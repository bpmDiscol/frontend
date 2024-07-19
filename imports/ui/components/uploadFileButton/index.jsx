import { Button, message, Upload } from "antd";
import React, { useState } from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { CloudUploadOutlined } from "@ant-design/icons";

export default function UploadFileButton({
  targetCollection,
  onUpload,
  defaultFileShow,
}) {
  const [isLoading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState();
  const isLoaded = currentFile || defaultFileShow;
  function remove() {
    deleteFile(targetCollection, currentFile.uid);
    setCurrentFile(null);
  }

  function upload(file) {
    setLoading(true);
    if (currentFile) deleteFile(targetCollection, currentFile._id);

    uploadFile(
      targetCollection,
      file,
      ({ _id, name }) => {
        const result = {
          uid: _id,
          name,
          status: "done",
        };
        setCurrentFile(result);
        onUpload(result);
        setLoading(false);
      },
      (error) => {
        console.log("error en la carga");
        console.log(error);
        message.error("Error al cargar archivo");
      }
    );
    return false;
  }

  return (
    <Upload
      maxCount={1}
      onRemove={remove}
      beforeUpload={upload}
      defaultFileList={defaultFileShow}
      disabled={isLoading}
      showUploadList={false}
    >
      <Button
        style={{
          backgroundColor: isLoaded ? "lightgreen" : "",
          fontWeight: isLoaded ? "bolder" : "normal",
        }}
        loading={isLoading}
        iconPosition="end"
        icon={<CloudUploadOutlined style={{ fontSize: "16px" }} />}
        onWaiting={() => setLoading(true)}
      >
        {isLoaded ? "Archivo cargado" : "Cargar archivo"}
      </Button>
    </Upload>
  );
}
