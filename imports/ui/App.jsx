import React from "react";
import SecurityProvider from "./context/securityProvider";
import Workshop from "./pages/workshop";
import MainViewProvider from "./context/mainViewProvider";
import { ConfigProvider } from "antd";
import { antStyles } from "./pages/styles/antStiles";
import { App as AntdApp } from "antd";
import NotificationsProvider from "./context/notificationsProvider";
import PublicLogin from "./components/publicLogin";
import AlertNotificationsProvider from "./context/alertNotificationsProvider";

export function App() {
  return (
      <AntdApp>
        <NotificationsProvider>
          <SecurityProvider publicPage={<PublicLogin />}>
            <ConfigProvider theme={antStyles}>
              <MainViewProvider defaultView="tasks">
                <AlertNotificationsProvider>
                  <Workshop />
                </AlertNotificationsProvider>
              </MainViewProvider>
            </ConfigProvider>
          </SecurityProvider>
        </NotificationsProvider>
      </AntdApp>
  );
}
