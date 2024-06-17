import React from "react";
import aplications from "../../config/applications.json";
import AppCard from "./appCard";
import { Empty, Flex, Spin } from "antd";

export default function Process() {
  const [tick, setTick] = React.useState(false);
  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2>Procesos disponibles</h2>
      {aplications.map((application, index) => {
        return (
          <AppCard key={index} application={application} setTick={setTick} />
        );
      })}
      {!tick && (
        <Flex
          style={{height: "60lvh" }}
          justify="center"
          align="center"
        >
          <Empty
            style={{ width: "100%" }}
            description="No tienes procesos disponibles"
          />
        </Flex>
      )}
    </div>
  );
}
