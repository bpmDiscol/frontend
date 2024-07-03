import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Button, Flex, Input, List, Typography } from "antd";
import { MinusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";

export default function OtpAdmin() {
  const { Title, Text } = Typography;
  const [searchTerm, setSearchTerm] = React.useState("");

  const listUsers = useTracker(() => {
    Meteor.subscribe("userData");
    return Meteor.users
      .find({}, { fields: { services: 1, username: 1 } })
      .fetch();
  });
  function filterMembers() {
    if (searchTerm)
      return listUsers.filter((user) => user.username.includes(searchTerm));
    return listUsers;
  }
  function deleteOTP(_id) {
    Meteor.call("delete_otp", _id, (err) => {
      if (err) console.log("no es posible eliminar");
    });
  }

  return (
    <Flex vertical justify="center" align="center" style={{ width: "100%" }}>
      <Flex vertical gap={12} style={{ width: "20rem" }}>
        <Title level={3}>Usuarios con OTP</Title>
        <Input
          placeholder="Busqueda"
          suffix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
        <List
          bordered
          dataSource={filterMembers()}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<UserOutlined style={{ color: "blue" }} />}
                title={item.username}
              />
              {item.services?.twoFactorAuthentication && (
                <Button
                  onClick={() => deleteOTP(item._id)}
                  shape="circle"
                  danger
                  title="Eliminar OTP"
                  icon={<MinusOutlined />}
                />
              )}
            </List.Item>
          )}
          style={{ height: "70dvh", overflowY: "auto", overflowX: "hidden" }}
        />
      </Flex>
    </Flex>
  );
}
