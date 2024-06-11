import { Col, Flex, Row, Space } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";
import { MenuOutlined, SettingFilled } from "@ant-design/icons";
import { safeLogOut } from "../../misc/userStatus";

export default function Header() {
  const { userName } = React.useContext(MainViewContext);

  return (
    <Flex
      justify="space-between" align="center"
      style={{ background: "#2271b1", padding: "5px 10px" }}
    >
      <Space>
        <Col xs={2} sm={0}>
          <MenuOutlined />
        </Col>
        <img src="/logo.png" id="main-logo" style={{ width: "100px" }} />
      </Space>
      <Space>
        {userName}
        <SettingFilled
          id="logout"
          style={{ cursor: "pointer" }}
          onClick={() => safeLogOut()}
        />
      </Space>
    </Flex>
  );
}
