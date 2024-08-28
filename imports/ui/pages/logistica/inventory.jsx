import { Flex } from "antd";
import React from "react";
import Stock from "../../components/stock";

export default function Inventory() {
  return (
    <Flex vertical style={{ width: "100%" }}>
      <Flex>
        <Stock />
      </Flex>
    </Flex>
  );
}
