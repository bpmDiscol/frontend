import { Flex } from "antd";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formats, modules } from "../../styles/quillStyle";

export default function PositionSalary({ concept, setConcept }) {

  return (
    <Flex style={{ width: "100%" }}>
      <ReactQuill
        value={concept}
        onChange={setConcept}
        formats={formats}
        modules={modules}
        style={{
          height: "14lh",
          width: "100%",
        }}
        id="concept-textfield"
      />
    </Flex>
  );
}
