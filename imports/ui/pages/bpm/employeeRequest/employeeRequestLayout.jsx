import React from "react";
import { Button, Flex, Segmented, Typography } from "antd";
import {
  BackwardOutlined,
  ForwardOutlined,
  RotateLeftOutlined,
  SendOutlined,
} from "@ant-design/icons";



const { Text, Title } = Typography;

export default function EmployeeRequestLayout() {



  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Requisición de personal<Text strong>(Petición de lider)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Segmented
          options={tabTitles}
          onChange={changeTab}
          defaultValue={0}
          value={currentTab}
        />
        <Flex
          vertical
          style={{ height: "55lvh", overflowY: "auto", overflowX: "hidden" }}
        >
          {tabView}
        </Flex>
      </Flex>
      <Flex id="horizontal-buttons" gap={"10px"}>
        <Button
          type="primary"
          onClick={() => handleButtonResponses("return")}
          icon={<RotateLeftOutlined />}
          id="return-button"
        >
          Regresar
        </Button>
        <Button
          type="primary"
          onClick={() => changeTab(currentTab - 1)}
          icon={<BackwardOutlined />}
          iconPosition="start"
          id="approve-button"
          disabled={currentTab == 0}
        >
          Anterior
        </Button>
        <Button
          type="primary"
          onClick={handleButtonNext}
          icon={
            currentTab == tabContents.length - 1 ? (
              <SendOutlined />
            ) : (
              <ForwardOutlined />
            )
          }
          iconPosition="end"
          id="approve-button"
          danger={currentTab == tabContents.length - 1}
        >
          {currentTab == tabContents.length - 1 ? "Enviar" : "Siguiente"}
        </Button>
      </Flex>
    </Flex>
  );
}
