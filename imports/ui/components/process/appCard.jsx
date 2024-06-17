import { Card } from "antd";
import React, { useState } from "react";
import { MainViewContext } from "../../context/mainViewProvider";
import Transition from "../transition";

const { Meta } = Card;

export default function AppCard({ application, setTick }) {
  const [appData, setAppData] = React.useState();
  const { setView } = React.useContext(MainViewContext);

  React.useEffect(() => {
    application.restrictions.forEach((role) => {
      Meteor.call("is_proccess_auth", role, (error, response) => {
        if (error) console.log("Error al contactar servidor");
        if (response && response !== "no token") {
          setAppData(true);
          setTick(true);
        }
      });
    });
  }, []);

  return (
    appData && (
      <Transition effect={"zoom-in"}>
        <Card
          style={{
            width:'340px',
            border: "1px solid black",
            position: "relative",
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(255,255,255,1) 60%), url('/blue_bg.png')",
            backgroundSize: "60%",
            backgroundPosition: "-30% 70%",
            backgroundRepeat: "no-repeat",
          }}
          onClick={() => setView(application?.page)}
          hoverable
        >
          <Meta
            avatar={
              <img
                src={`/${application.processName}.png`}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            }
            title={application?.displayName}
            description={application?.description}
          />
        </Card>
      </Transition>
    )
  );
}
