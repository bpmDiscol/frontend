import Icon from "@ant-design/icons";
import { Card, Flex } from "antd";
import React from "react";
import "./card.css"


export default function ButtonLink({ title, icon }) {
  return (
    <Card
      hoverable
      id="button-link-card"
      style={{
        border: "1px solid gray",
        borderRadius: "10px",
        height: "19vh",
        width: "10vw",
      }}
    >
      <Flex vertical align="center" justify="space-between" >
        <Icon
          component={icon}
          style={{
            fontSize: "clamp(1rem, 2.5rem, 5rem)",
            padding: "0 0 10px 0",
            color: "#017db2",
            fontWeight: "bold",
          }}
        />
        <div className="button-text">
          {title}
        </div>
      </Flex>
    </Card>
  );
}
