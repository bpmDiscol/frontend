import { Flex } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";
import { UnlockFilled } from "@ant-design/icons";

export default function Header() {
  const { userName } = React.useContext(MainViewContext);

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ background: "#2271b1", padding: "5px 20px", height: "30px" }}
    >
      <img src="/logo.png" id="main-logo" style={{ width: "120px" }} />

      <Flex style={{ color: "white", fontWeight: "bold" }} gap={10}>
        {userName}
        <UnlockFilled />
      </Flex>
    </Flex>
  );
}
