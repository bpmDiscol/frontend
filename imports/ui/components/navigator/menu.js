import {
  AppstoreAddOutlined,
  BellFilled,
  BellOutlined,
  SettingOutlined,
  SisternodeOutlined,
} from "@ant-design/icons";
import React from "react";

export const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <AppstoreAddOutlined />,
  },
  {
    key: "tasks",
    label: "Tareas",
    icon: <SisternodeOutlined />,
  },
  {
    key: "process",
    label: "Iniciar proceso",
    icon: <SettingOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "notifications",
    label: "Notificaciones",
    icon: <BellOutlined />,
  },
];
