import { Button, Flex, List, Menu } from "antd";
import React from "react";
import Icon, { LockFilled } from "@ant-design/icons";
import { menuItems } from "./menu";
import { MainViewContext } from "../../context/mainViewProvider";
import { safeLogOut } from "../../misc/userStatus";

export default function Navigator() {
  const { setView } = React.useContext(MainViewContext);
  return (
    <Flex vertical>
      <List
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item
            onClick={() => setView(item.key)}
            style={{
              cursor: "pointer",
              background: "transparent",
              paddingLeft: "16px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "white")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <List.Item.Meta
              avatar={<Icon component={item.icon} />}
              title={item.label}
            />
          </List.Item>
        )}
      />
      <Flex vertical justify="end" style={{ height: "50lvh" }}>
        <Button onClick={safeLogOut} icon={<LockFilled />} type="text">
          Cerrar sesion
        </Button>
      </Flex>
    </Flex>
  );
}
