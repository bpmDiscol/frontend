import { Divider, Flex } from "antd";
import React from "react";
import ReactQuill from "react-quill";
import { formats, modules } from "../../pages/styles/quillStyle";

export default function Notes({
  targetField,
  currentCVFiles,
  setCurrentCVFiles,
}) {
  return (
    <Flex vertical align="center" justify="center">
      <Divider>Petición de examenes médicos</Divider>
      {currentCVFiles && (
        <ReactQuill
          value={currentCVFiles.health_request}
          onChange={(value) => setCurrentCVFiles(value, targetField)}
          formats={formats}
          modules={modules}
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
