import { Col, Flex, Row, Space } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";
import { MenuOutlined, SettingFilled } from "@ant-design/icons";
import { safeLogOut } from "../../misc/userStatus";

export default function Header() {
  const { userName } = React.useContext(MainViewContext);

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ background: "#2271b1", padding: "5px 10px", height: "30px" }}
    >
      <img src="/logo.png" id="main-logo" style={{ width: "120px" }} />

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
