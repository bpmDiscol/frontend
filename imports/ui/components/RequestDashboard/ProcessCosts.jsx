import React from "react";
import { Flex } from "antd";

import ProcessCostsChart from "./processCostsTimes";

export default function ProcessCosts({ requestProcess }) {
  return (
    <Flex vertical gap={20} style={{ width: "98%" }}>
      {requestProcess && <ProcessCostsChart requestProcess={requestProcess} />}
    </Flex>
  );
}
