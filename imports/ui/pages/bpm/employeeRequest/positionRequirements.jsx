import React from "react";
import BPMEditor from "../../../components/editor";

export default function PositionRequirements({ requestEmployee }) {
  return <BPMEditor requestData={requestEmployee.requirements} />;
}
