import React from "react";
import { AlertNotificationsContext } from "../context/alertNotificationsProvider";
import { Flex, List } from "antd";
import { formatDate } from "../misc/formatDate";

export default function Notifications() {
  const { alerts } = React.useContext(AlertNotificationsContext);

  return (
    <Flex vertical align="center" style={{ width: "100%" }}>
      <List
        itemLayout="vertical"
        style={{ width: "100%" }}
        bordered
        dataSource={alerts}
        renderItem={(alert) => (
          <List.Item>
            <List.Item.Meta
              title={alert.message}
              description={formatDate(alert.date)}
            />
          </List.Item>
        )}
      />
    </Flex>
  );
}
