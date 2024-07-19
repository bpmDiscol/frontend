import React from "react";
import aplications from "../../config/applications.json";
import AppCard from "./appCard";
import { Empty, Flex, Spin } from "antd";

export default function Process() {
  const [loading, setLoading] = React.useState(false);
  const [apps, setApps] = React.useState([]);

  async function getProcessData() {
    setLoading(true);
    const test = aplications.map((app) => {
      return Meteor.callAsync("is_proccess_auth", app.restrictions);
    });
    Promise.all(test)
      .then((apps) => {
        const displayedApps = aplications.filter((_, index) => apps[index]);
        setLoading(false);
        setApps(displayedApps);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  React.useEffect(() => {
    getProcessData();
  }, []);

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2>Procesos disponibles</h2>
      <Flex gap={"10px"}>
        {apps.map((application, index) => {
          return (
            <AppCard key={Math.random() * 10000} application={application} />
          );
        })}
      </Flex>
      {!apps?.length && !loading && (
        <Flex style={{ height: "60lvh" }} justify="center" align="center">
          <Empty
            style={{
              width: "100%",
              paddingTop: "20%",
              background:
                "radial-gradient(circle, rgba(9,9,121,1) 0%, rgba(245,245,245,0) 80%)",
              height: "99lvh",
              backgroundOrigin: "border-box",
              opacity: 0.3,
            }}
            description={
              <h2 style={{ color: "HighlightText" }}>
                No tienes procesos disponibles
              </h2>
            }
            image="/logo.png"
          />
        </Flex>
      )}
      <Spin spinning={loading} fullscreen />
    </div>
  );
}
