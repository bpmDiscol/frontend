import { Flex, Input, InputNumber, Space, Switch, Typography } from "antd";
import React, { useState } from "react";

const { Text } = Typography;

export default function RequestANS({ ANS, setANS }) {
  const [myANS, setMyANS] = useState(ANS);
  return (
    <Flex vertical align="start" gap={16} style={{ padding: "2rem" }}>
      <Flex gap={16} align="center" justify="center">
        <Text>ANS Gestion Humana</Text>
        <InputNumber
          min={1}
          max={100}
          onChange={(value) => {
            setANS({ ...myANS, hhrr: value });
            setMyANS({ ...myANS, hhrr: value });
          }}
          value={myANS?.hhrr || 0}
        />
        <Text>días</Text>
      </Flex>
      <Flex gap={16} align="center" justify="center">
        <Text>¿Tiene entrevista técnica?</Text>
        <Switch
          checkedChildren="Si"
          unCheckedChildren="No"
          onChange={(value) => {
            setANS({ ...myANS, isTechInterview: value });
            setMyANS({ ...myANS, isTechInterview: value });
          }}
          value={myANS?.isTechInterview}
        />
      </Flex>
    </Flex>
  );
}
