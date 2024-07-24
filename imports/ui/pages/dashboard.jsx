import React from "react";
import { Flex } from "antd";
import OpenToMembership from "../components/openToMembership";
import RequestDashboard from "../components/RequestDashboard";
import ProcessCosts from "../components/RequestDashboard/ProcessCosts";

export default function Dashboard() {
  return (
    <Flex
      vertical
      gap={16}
      style={{
        padding: "0 0 20px 20px",
        backgroundColor: "#F0F2F5",
        width: "100%",
        overflow: "auto",
      }}
    >
      <h1>Mis estadisticas</h1>
      <OpenToMembership memberships={[["director", "discol"]]}>
        <ProcessCosts />
      </OpenToMembership>
      <OpenToMembership
        memberships={[
          ["director", "discol"],
          ["Lider", "Gestion_Humana"],
        ]}
      >
        <RequestDashboard />
      </OpenToMembership>
    </Flex>
  );
}
