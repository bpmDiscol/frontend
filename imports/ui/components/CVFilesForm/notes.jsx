import { Divider, Flex, Input } from "antd";
import React from "react";
const { TextArea } = Input;

export default function Notes({
  targetField,
  currentCVFiles,
  setCurrentCVFiles,
}) {
  return (
    <Flex vertical align="center" justify="center">
      <Divider>Petición de examenes médicos</Divider>
      {currentCVFiles && (
        <TextArea
          value={currentCVFiles[targetField]}
          onChange={(value) => setCurrentCVFiles(value.currentTarget.value, targetField)}
          style={{
            height: "50dvh",
            width: "calc(100% - 5dvw)",
          }}
          id="concept-textfield"
        />
      )}
    </Flex>
  );
}
