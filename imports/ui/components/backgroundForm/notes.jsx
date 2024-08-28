import { Divider, Flex, Input } from "antd";
import React from "react";
const { TextArea } = Input;

export default function Notes({
  targetField,
  currentBackground,
  setCurrentBackground,
}) {
  return (
    <Flex vertical align="center" justify="center">
      <Divider>Notas</Divider>
      {currentBackground && (
        <TextArea
          value={currentBackground.notes}
          onChange={(value) => setCurrentBackground(value, targetField)}
        
          style={{
            height: "14lh",
            width: "100%",
          }}
          id="concept-textfield"
        />
      )}
    </Flex>
  );
}
