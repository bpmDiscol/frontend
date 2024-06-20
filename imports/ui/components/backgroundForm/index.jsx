import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { Upload, Typography, Flex } from "antd";

export default function BackgroundForm() {
  const { Title } = Typography;



  return (
    <Flex vertical>
      <Title>Antecedentes judiciales</Title>
    </Flex>
  );
}
