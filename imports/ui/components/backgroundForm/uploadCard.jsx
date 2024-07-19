import React from "react";
import { Typography, Flex, Row, Col } from "antd";
import UploadFileButton from "../uploadFileButton";

export default function UploadFile({
  title,
  targetField,
  currentBackground,
  setCurrentBackground,
}) {
  const { Title } = Typography;
  const currentFile = Object.keys(currentBackground).includes(targetField)
    ? currentBackground[`${targetField}`]
    : null;

  function onLoad(file) {
    setCurrentBackground({ _id: file.uid, name: file.name }, targetField);
  }

  return (
    <Flex justify="center" style={{ width: "340px", height: "6rem" }}>
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
          <Title level={4} style={{ margin: 0 }}>
            {title}
          </Title>
        </Col>
        <Col span={12}>
          <Flex
            justify="center"
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
            }}
          >
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
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
}
