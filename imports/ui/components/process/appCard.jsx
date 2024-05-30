import { Card } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";

import config from "../../../private/config.json"
const { Meta } = Card;

export default function AppCard({ application }) {
  const [appData, setAppData] = React.useState();
  const { setView } = React.useContext(MainViewContext);

  React.useEffect(() => {
    application.restrictions.forEach((role) => {
      Meteor.call("is_proccess_auth", role, (error, response) => {
        if (response && response !== "no token") {
          Meteor.call(
            "get_application",
            application.processName,
            (_, response) => {
              if (response !== "no token") setAppData(response[0]);
            }
          );
        }
      });
    });
  }, []);
  return (
    appData && (
      <Card
        style={{
          width: 300,
          border: "1px solid black",
        }}
        onClick={()=>setView(application?.page)}
        hoverable
      >
        <Meta
          avatar={
            <img
              src={
                appData?.icon
                  ? `${config.BASE_URL}${appData?.icon.slice(2)}`
                  : "/logo-image.png"
              }
              style={{
                width: 50,
                height: 50,
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          }
          title={appData?.displayName}
          description={appData?.description}
        />
      </Card>
    )
  );
}
