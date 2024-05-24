import { Menu } from "antd";
import React from "react";
import { menuItems } from "./menu";
import { MainViewContext } from "../../context/mainViewProvider";

export default function Navigator() {
  const { setView } = React.useContext(MainViewContext);
  return (
    <Menu
      onClick={(e) => setView(e.key)}
      defaultSelectedKeys={[sessionStorage.getItem("currentView")]}
      mode="inline"
      items={menuItems}
    />
  );
}
