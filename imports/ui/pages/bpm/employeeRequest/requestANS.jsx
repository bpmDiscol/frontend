import { Flex, Switch, Typography, DatePicker, Tag } from "antd";
import moment from "moment";
import React, { useState } from "react";

const { Text } = Typography;

export default function RequestANS({ ANS, setANS }) {
  const [myANS, setMyANS] = useState(ANS);
  return (
    <Flex vertical align="start" gap={16} style={{ padding: "2rem" }}>
      <Flex gap={16} align="center" justify="center">
        <Text>ANS Gestion Humana hasta</Text>
        <DatePicker
          id="ANS-Date-Picker"
          placeholder="Fecha de finalización"
          onChange={(_, dateString) => {
            const difference = moment(dateString).diff(
              moment().format("YYYY-MM-DD"),
              "days"
            );
            setANS({ ...myANS, hhrr: difference });
            setMyANS({ ...myANS, hhrr: difference });
          }}
        />

        <Tag color="blue-inverse" style={{fontSize:'20px', padding:'5px 15px'}}>{myANS?.hhrr || 0} días</Tag>
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
