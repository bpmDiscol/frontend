import React from "react";
import AdminDashboard from "../components/AdminDashboard";
import { Flex } from "antd";

export default function Dashboard() {
  return (
    <Flex
      vertical
      style={{
        padding: "0 0 20px 20px",
        backgroundColor: "#F0F2F5",
        width: "100%",
        overflow: "auto",
      }}
    >
      <h1>Mis estadisticas</h1>

      <AdminDashboard />
    </Flex>
  );
}
