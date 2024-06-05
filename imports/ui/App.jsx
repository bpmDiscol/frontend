import React from "react";
import { CookiesProvider } from "react-cookie";
import SecurityProvider from "./context/securityProvider";
import Workshop from "./pages/workshop";
import MainViewProvider from "./context/mainViewProvider";
import { ConfigProvider } from "antd";
import { antStyles } from "./pages/styles/antStiles";
import { App as AntdApp } from "antd";
import NotificationsProvider from "./context/notificationsProvider";
import PublicPage from "./components/publicPage";

export function App() {
  return (
    <CookiesProvider>
      <AntdApp>
        <NotificationsProvider>
          <SecurityProvider publicPage={<PublicPage />}>
            <ConfigProvider theme={antStyles}>
              <MainViewProvider defaultView="dashboard">
                <Workshop />
              </MainViewProvider>
            </ConfigProvider>
          </SecurityProvider>
        </NotificationsProvider>
      </AntdApp>
    </CookiesProvider>
  );
}
