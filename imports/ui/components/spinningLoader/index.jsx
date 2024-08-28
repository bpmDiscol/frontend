import { Empty, Flex, Spin } from "antd";
import React from "react";
import Transition from "../transition";

export default function SpinningLoader({ condition, content }) {
  return (
    <Flex vertical style={{ height: "60dvh", overflowY: "auto",  overflowX:'hidden', width:'100%' }}>
      <Transition effect={"zoom-in"}>
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
      </Transition>
    </Flex>
  );
}
