import React from "react";
import BPMEditor from "../../../components/editor";

export default function RequestObservations({ requestData, update }) {
  return (
    <div>
      {update && (
        <BPMEditor
          requestData={requestData?.observations}
          update={update}
          field={"observations"}
        />
      )}
    </div>
  );
}
