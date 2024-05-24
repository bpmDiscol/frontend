import React from "react";
import aplications from "../../config/applications.json";
import AppCard from "./appCard";

export default function Process() {
  return (
    <div>
      {aplications.map((application, index) => {
        return <AppCard key={index} application={application} />;
      })}
    </div>
  );
}
