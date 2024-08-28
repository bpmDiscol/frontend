import React from "react";
import { Flex } from "antd";

import ProcessTimesChart from "./processTimesChart";
import ProcessRequests from "./processRequests";
import Founded from "./founded";

export default function RequestDashboard({ requestProcess, approvations }) {
  return (
    <Flex vertical gap={20} style={{ width: "98%" }}>
      <ProcessRequests
        requestProcess={requestProcess}
        approvations={approvations}
      />
      <ProcessTimesChart
        requestProcess={requestProcess}
        approvations={approvations}
      />
      <Founded />
    </Flex>
  );
}
