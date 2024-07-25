import React from "react";
import { Typography, Flex, Row, Col } from "antd";
import UploadFileButton from "../uploadFileButton";

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

  function onLoad(file) {
    setCurrentCVFiles({ _id: file?.uid, name: file?.name }, targetField);
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
      <Row gutter={["10px", "10px"]}>
        <Col
          span={12}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Title
            level={5}
            style={{ margin: 0, textAlign: "right", paddingRight: "10px" }}
          >
            {title}
          </Title>
        </Col>
        <Col span={12} style={{ display: "flex", alignItems: "center" }}>
          <UploadFileButton
            targetCollection={"background"}
            onUpload={onLoad}
            defaultFileShow={
              currentFile
                ? [
                    {
                      uid: currentFile?._id,
                      name: currentFile?.name,
                      status: "done",
                    },
                  ]
                : undefined
            }
          />
        </Col>
      </Row>
    </Flex>
  );
}
