import React from "react";
import { CookiesProvider } from "react-cookie";
import { SnackbarProvider } from "notistack";
import SecurityProvider from "./context/securityProvider";
import Public from "./pages/public";
import Workshop from "./pages/workshop";
import MainViewProvider from "./context/mainViewProvider";

export function App() {
  return (
    <CookiesProvider>
      <SnackbarProvider>
        <SecurityProvider publicPage={<Public />}>
          <MainViewProvider defaultView="dashboard">
            <Workshop />
          </MainViewProvider>
        </SecurityProvider>
      </SnackbarProvider>
    </CookiesProvider>
  );
}
