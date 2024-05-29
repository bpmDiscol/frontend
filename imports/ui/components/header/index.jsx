import { Flex, Space } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";
import { SettingFilled } from "@ant-design/icons";
import { safeLogOut } from "../../misc/userStatus";

export default function Header() {
  const { userName } = React.useContext(MainViewContext);

  return (
    <Flex
      style={{ background: "#345678", padding: "5px 10px" }}
      justify="space-between"
      align="center"
    >
      <img src="/logo.png" id="main-logo" style={{ width: "100px" }} />

      <Space wrap style={{ color: "HighlightText" }}>
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
