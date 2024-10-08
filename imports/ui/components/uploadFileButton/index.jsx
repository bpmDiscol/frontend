import { Button, message, Spin, Upload } from "antd";
import React, { useState } from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { CloudUploadOutlined, LoadingOutlined } from "@ant-design/icons";

export default function UploadFileButton({
  targetCollection,
  onUpload,
  defaultFileShow,
}) {
  const [isLoading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState(
    defaultFileShow ? defaultFileShow[0] : null
  );
  const isLoaded = currentFile || defaultFileShow;
  function remove() {
    deleteFile(targetCollection, currentFile.uid);
    onUpload(null);
    setCurrentFile(null);
  }

  function upload(file) {
    if (file.size > 10485760) {
      message.warning("El archivo no puede tener mas de 10Mb");
      return;
    }
    setLoading(true);

    uploadFile(
      targetCollection,
      file,
      ({ _id, name }) => {
        const result = {
          uid: _id,
          name,
          status: "done",
        };
        if (currentFile) deleteFile(targetCollection, currentFile?.uid);
        setCurrentFile(result);
        onUpload(result);
        setLoading(false);
      },
      (error) => {
        message.warning(error.reason);
        setLoading(false);
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
          width: "10rem",
        }}
        loading={isLoading}
        iconPosition="end"
        icon={<CloudUploadOutlined style={{ fontSize: "16px" }} />}
        onWaiting={() => setLoading(true)}
      >
        {isLoaded ? "Archivo cargado" : "Cargar archivo"}
      </Button>
      <Spin
        fullscreen
        spinning={isLoading}
        indicator={<LoadingOutlined spin />}
      />
    </Upload>
  );
}
