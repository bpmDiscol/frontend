import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Button, Flex, Input, List, Space, Typography, message } from "antd";
import { BlackListCollection } from "../../../api/blackList/blackListCollection";
import {
  BellOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";

export default function CredentialApp() {
  const { Title, Text } = Typography;
  const [currentTarget, setCurrenTarget] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const blackList = useTracker(() => {
    Meteor.subscribe("blackList");
    return BlackListCollection.find({}).fetch();
  });

  function logError(err) {
    if (err) {
      console.error("No se pudo guardar. Revisa tu conección");
      console.log(err);
    }
  }

  function addMember() {
    Meteor.call("add_blackList_member", currentTarget, (err) => logError(err));
    setCurrenTarget("");
  }
  function deleteMember(id) {
    Meteor.call("delete_blackList_member", id, (err) => logError(err));
  }

  function filterMembers() {
    if (searchTerm)
      return blackList.filter((blacklistItem) =>
        blacklistItem.member.includes(searchTerm)
      );
    return blackList;
  }

  return (
    <Flex vertical align="center" style={{ width: "100%" }}>
      <Flex vertical gap={12} >
        <Title level={3}>Elementos con restricciones</Title>
        <List
          header={
            <Input
              placeholder="Agregar nuevo miembro"
              suffix={<UserAddOutlined />}
              value={currentTarget}
              onChange={(e) => setCurrenTarget(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  addMember();
                }
              }}
            />
          }
          bordered
          dataSource={filterMembers()}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<BellOutlined style={{ color: "red" }} />}
                title={item.member}
              />
              <Button
                onClick={() => deleteMember(item._id)}
                shape="circle"
                icon={<UserDeleteOutlined />}
              />
            </List.Item>
          )}
          style={{ height: "70dvh" }}
        />
        <Input
          placeholder="Busqueda"
          suffix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
        />
      </Flex>
    </Flex>
  );
}
