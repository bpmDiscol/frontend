import { Flex } from "antd";
import React from "react";

export default function PositionRequirements({ requestEmployee }) {
  React.useEffect(() => {
    const requirements = document.getElementById("requirements");
    requirements.innerHTML = requestEmployee.requirements;
  }, []);
  return (
    <Flex vertical style={{ padding: "0 10px" }}>
      <p id="requirements"></p>
    </Flex>
  );
}
