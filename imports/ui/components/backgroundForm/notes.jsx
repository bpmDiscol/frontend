import { Divider, Flex } from "antd";
import React from "react";
import ReactQuill from "react-quill";
import { formats, modules } from "../../pages/styles/quillStyle";

export default function Notes({
  targetField,
  currentBackground,
  setCurrentBackground,
}) {
  return (
    <Flex vertical align="center" justify="center">
      <Divider>Notas</Divider>
      {currentBackground && (
        <ReactQuill
          value={currentBackground.notes}
          onChange={(value) => setCurrentBackground(value, targetField)}
          formats={formats}
          modules={modules}
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
