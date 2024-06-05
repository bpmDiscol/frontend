import React from "react";
import { notification } from "antd";

export const NotificationsContext = React.createContext();

export default function NotificationsProvider({ children }) {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "topRight",
    });
  };

  return (
    <NotificationsContext.Provider value={{ openNotification }}>
      {contextHolder}
      {children}
    </NotificationsContext.Provider>
  );
}
