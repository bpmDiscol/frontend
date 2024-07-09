import React from "react";
import AdminDashboard from "../components/AdminDashboard";

export default function Dashboard() {
  return (
    <div
      className="task-contaner"
      style={{ paddingLeft: "20px", backgroundColor: "#F0F2F5", width: "100%" }}
    >
      <div>
        <h1>Mis estadisticas</h1>
      </div>
      <AdminDashboard />
    </div>
  );
}
