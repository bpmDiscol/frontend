import { Flex } from "antd";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function PositionSalary({ concept, setConcept }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];
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
