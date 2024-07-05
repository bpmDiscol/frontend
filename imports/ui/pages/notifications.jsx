import React from "react";
import { AlertNotificationsContext } from "../context/alertNotificationsProvider";
import { Flex, List } from "antd";
import { formatDate } from "../misc/formatDate";

export default function Notifications() {
  const { alerts } = React.useContext(AlertNotificationsContext);

  return (
    <Flex
      vertical
      align="center"
      style={{ width: "100%", height: "calc(90dvh - 40px)", padding: "2% 0" }}
    >
      <List
        itemLayout="vertical"
        style={{ width: "100%", margin: "1% 0" }}
        bordered
        dataSource={alerts?.sort((a, b) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateB - dateA;
        })}
        renderItem={(alert) => (
          <List.Item>
            <List.Item.Meta
              avatar={<img src={`/alerts/${alert.process}.png`} />}
              title={alert.message}
              description={formatDate(alert.date)}
            />
          </List.Item>
        )}
      />
    </Flex>
  );
}
