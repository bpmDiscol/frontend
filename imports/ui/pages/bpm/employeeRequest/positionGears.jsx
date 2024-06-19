import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { Typography, List, Flex, Tooltip } from "antd";
import React from "react";
import { gearOptions } from "../../../misc/gearsOptions";

const { Text } = Typography;

export default function PositionGears({ requestEmployee }) {
  function ListItems({ header, dataSource, checkavailability = false }) {
    return (
      <List
        header={header}
        style={{ width: "50%", padding: "0 10px" }}
        size="small"
        itemLayout="horizontal"
        grid={{
          gutter: 10,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={dataSource}
        renderItem={(item) => (
          <Tooltip
            placement="left"
            title={
              checkavailability
                ? requestEmployee.gears[item.value] == true ||
                  requestEmployee.gears[item.value] == "true"
                  ? "Requerido"
                  : "No requerido"
                : "Adicional"
            }
          >
            <List.Item>
              <Text size={18}>
                {checkavailability ? (
                  requestEmployee.gears[item.value] == true ||
                  requestEmployee.gears[item.value] == "true" ? (
                    <CheckCircleTwoTone twoToneColor={"green"} />
                  ) : (
                    <CloseCircleTwoTone twoToneColor={"red"} />
                  )
                ) : (
                  <PlusCircleTwoTone />
                )}{" "}
                {checkavailability ? item.label : item}
              </Text>
            </List.Item>
          </Tooltip>
        )}
      />
    );
  }

  return (
    <Flex justify="center">
      <ListItems
        header="Equipo regular"
        dataSource={gearOptions}
        checkavailability
      />
      <ListItems
        header={"Equipo adicional"}
        dataSource={requestEmployee.gears.other}
      />
    </Flex>
  );
}
