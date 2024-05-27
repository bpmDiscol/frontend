import React from 'react'
import ReactQuill from 'react-quill';
import { formats, modules } from '../../styles/quillStyle';

export default function RequestObservations({ requestData, update }) {
  const [observations, setObservations] = React.useState("");

  React.useEffect(() => {
    if (requestData) setObservations(requestData?.observations);
  }, [requestData]);

  function updateText(value) {
    setObservations(value);
    update("observations", value);
  }
  return (
    <ReactQuill
      value={observations}
      onChange={updateText}
      formats={formats}
      modules={modules}
      style={{
        height: "14lh",
        width: "100%",
      }}
      id="observations"
    />
  );
}
