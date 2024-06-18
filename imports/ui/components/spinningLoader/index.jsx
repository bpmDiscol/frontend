import { Empty, Flex, Spin } from "antd";
import React from "react";

export default function SpinningLoader({ condition, content }) {
  return (
    <Flex vertical style={{ height: "55lvh", overflowY: "auto" }}>
      <Spin spinning={!condition} tip="Por favor espere un momento...">
        {condition && content}
        {!condition && (
          <Empty
            image={"/logo.png"}
            style={{
              paddingTop: "25lvh",
              background:
                "radial-gradient(circle, rgba(9,9,121,1) 0%, rgba(245,245,245,0) 70%)",
              height: "55lvh",
              opacity: 0.3,
            }}
            description=""
          />
        )}
      </Spin>
    </Flex>
  );
}