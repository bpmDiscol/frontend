import React from "react";
import { Flex, List, Switch, Typography } from "antd";
const { Title } = Typography;

export default function ListCheckItems({ options, update, requestData }) {
  function getDefaultValue(itemValue) {
    if (requestData)
      if (Object.keys(requestData).includes("gears"))
        if (Object.keys(requestData.gears).includes(itemValue))
          return requestData?.gears[itemValue];
    update(`gears.${itemValue}`, false);
    return false;
  }
  return (
    <List
      header={<Title level={5}>Selecciona de la lista...</Title>}
      grid={{ gutter: 16, column: 2 }}
      style={{ width: "60%" }}
      size="small"
      itemLayout="horizontal"
      dataSource={options}
      renderItem={(item) => (
        <List.Item>
          <Flex gap={16} align="center" justify="space">
            <Switch
              defaultValue={getDefaultValue(item.value)}
              onChange={(value) => update(`gears.${item.value}`, value)}
            />
            {item.label}
          </Flex>
        </List.Item>
      )}
    />
  );
}
