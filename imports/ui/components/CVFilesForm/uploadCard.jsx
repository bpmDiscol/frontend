import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { Upload, Typography, Flex, Button, Row, Col } from "antd";
import { CheckOutlined, UploadOutlined } from "@ant-design/icons";

export default function UploadFile({
  title,
  targetField,
  currentCVFiles,
  setCurrentCVFiles,
}) {
  const { Title } = Typography;
  const currentFile = Object.keys(currentCVFiles).includes(targetField)
    ? currentCVFiles[`${targetField}`]
    : null;

  function remove(file) {
    deleteFile("background", file.uid);
    setNewBackground(null);
  }

  function upload(file) {
    if (currentFile) deleteFile("background", currentFile._id);
    uploadFile("background", file, ({ _id, name }) => {
      setCurrentCVFiles({ _id, name }, targetField);
      console.log("uploading...");
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
    <Flex
      justify="center"
      style={{
        width: "340px",
        height: "3rem",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "5px 5px 15px black",
        border: "1px solid black",
      }}
    >
      <Row gutter={["10px", "10px"]} >
        <Col
          span={12}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Title level={5} style={{ margin: 0, textAlign:'right', paddingRight:'10px' }}>
            {title}
          </Title>
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
