import React from "react";

import BPMEditor from "../../../components/editor";

export default function RequestRequirements({ requestData, update }) {
  return (
    <div>
      <BPMEditor
        requestData={requestData?.requirements}
        update={update}
        field={"requirements"}
      />
    </div>
  );
}
