import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { Upload, Typography, Flex, Button, Row, Col } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  UploadOutlined,
} from "@ant-design/icons";

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

  function remove(file) {
    deleteFile("background", file.uid);
    setNewBackground(null);
  }

  function upload(file) {
    if (currentFile) deleteFile("background", currentFile._id);
    uploadFile("background", file, ({ _id, name }) => {
      setNewBackground({ _id, name });
      console.log('uploading...')
    });

    return false;
  }

  function defaultFileShow() {
    return currentFile
      ? [
          {
            uid: currentFile?._id,
            name: currentFile?.name,
            status: "done",
          },
        ]
      : [];
  }

  return (
    <Flex justify="center" style={{ width: "340px", height:'6rem' }}>
      <Row
        gutter={["10px", "10px"]}
        style={{
          border: "1px solid black",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "5px 5px 15px black",
        }}
      >
        <Col span={12}>
          <Title level={4} style={{margin:0}}>{title}</Title>
        </Col>
        <Col span={12} style={{ display: "flex", alignItems: "center" }}>
          <Upload
            maxCount={1}
            onRemove={remove}
            beforeUpload={upload}
            defaultFileList={defaultFileShow}
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
        </Col>
      </Row>
    </Flex>
  );
}
