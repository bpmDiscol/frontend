import React from "react";
import "react-quill/dist/quill.snow.css";
import BPMEditor from "../../../components/editor";

export default function PositionSalary({ concept, setConcept }) {
  return (
    <BPMEditor requestData={concept} field={"local"} update={setConcept} />
  );
}
