import React from "react";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "notistack";
import SecurityProvider from "./context/securityProvider";
import Public from "./pages/public";
import Workshop from "./pages/workshop";
import MainViewProvider from "./context/mainViewProvider";
import { ConfigProvider } from "antd";
import { antStyles } from "./pages/styles/antStiles";

export function App() {
  return (
    <CookiesProvider>
      <SnackbarProvider>
        <SecurityProvider publicPage={<Public />}>
          <ConfigProvider theme={antStyles}>
            <MainViewProvider  defaultView="dashboard">
              <Workshop />
            </MainViewProvider>
          </ConfigProvider>
        </SecurityProvider>
      </SnackbarProvider>
    </CookiesProvider>
  );
}
