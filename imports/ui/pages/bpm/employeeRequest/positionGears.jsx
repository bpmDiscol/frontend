import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import { Space, Typography, List, Flex, Row, Col, Tooltip } from "antd";
import React from "react";

const { Text } = Typography;

export default function PositionGears({ requestEmployeeData }) {
  const listItems = [
    {
      label: "Computador de escritorio",
      value: "isDesktopPC",
    },
    {
      label: "Computador portatil",
      value: "isLaptop",
    },
    {
      label: "Monitor de computador",
      value: "isScreen",
    },
    {
      label: "Teclado",
      value: "isKeyboard",
    },
    {
      label: "Ratón",
      value: "isMouse",
    },
    {
      label: "Correo electrónico corporativo",
      value: "isEmail",
    },
    {
      label: "Escritorio",
      value: "isDesk",
    },
    {
      label: "Silla",
      value: "isChair",
    },
  ];

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
                ? requestEmployeeData.gears[item.value]? "Requerido": "No requerido"
                : 'Adicional'
            }
          >
            <List.Item>
              <Text size={18}>
                {checkavailability ? (
                  requestEmployeeData.gears[item.value] ? (
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
        dataSource={listItems}
        checkavailability
      />
      <ListItems
        header={"Equipo adicional"}
        dataSource={requestEmployeeData.gears.other}
      />
    </Flex>
  );
}
