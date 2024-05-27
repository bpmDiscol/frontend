import React from "react";
import ReactQuill from "react-quill";
import { formats, modules } from "../../styles/quillStyle";

export default function RequestRequirements({ requestData, update }) {
  const [requirements, setRequirements] = React.useState("");

  React.useEffect(() => {
    if (requestData) setRequirements(requestData?.requirements);
  }, [requestData]);

  function updateText(value) {
    setRequirements(value);
    update("requirements", value);
  }
  return (
    <ReactQuill
      value={requirements}
      onChange={updateText}
      formats={formats}
      modules={modules}
      style={{
        height: "14lh",
        width: "100%",
      }}
      id="requirements"
    />
  );
}
