import Icon from "@ant-design/icons";
import { Card, Flex } from "antd";
import React from "react";

export default function ButtonLink({ title, icon }) {
  return (
    <Card
      hoverable
      style={{
        border: "1px solid gray",
        borderRadius: "10px",
        height: "16vh",
        width: "10vw",
      }}
      cover={
        <Icon
          component={icon}
          style={{
            fontSize: 50,
            paddingTop: "20px",
            color: "#017db2",
            fontWeight: "bold",
          }}
        />
      }
    >
      <Flex justify="center">{title}</Flex>
    </Card>
    // <Flex
    //   style={{
    //     border: "1px solid gray",
    //     borderRadius: "10px",
    //     height: "16vh",
    //     width: "10vw",
    //     cursor: "pointer",
    //   }}
    //   onMouseEnter={}
    // >
    //   link to
    // </Flex>
  );
}
