import React from "react";
import { notification } from "antd";

export const NotificationsContext = React.createContext();

export default function NotificationsProvider({ children }) {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    type,
    message,
    description = "",
    btn = undefined,
    key = undefined,
    duration = 3
  ) => {
    api[type]({
      message,
      description: description,
      btn,
      key,
      placement: "topRight",
      showProgress: true,
      duration,
    });
  };

  return (
    <NotificationsContext.Provider value={{ openNotification, api }}>
      {contextHolder}
      {children}
    </NotificationsContext.Provider>
  );
}
