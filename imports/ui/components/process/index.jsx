import React from "react";
import aplications from "../../config/applications.json";
import AppCard from "./appCard";

export default function Process() {
  return (
    <div style={{padding:'20px'}}>
      <h2>Procesos disponibles</h2>
      {aplications.map((application, index) => {
        return <AppCard key={index} application={application}/>;
      })}
    </div>
  );
}
