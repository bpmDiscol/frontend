import { Card } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";

// import config from "../../../private/config.json"
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
          title={appData?.displayName}
          description={appData?.description}
        />
        {/* <img
          src="/blue_bg.png"
          style={{
            position: "absolute",
            top: 0,
            left: -20,
            objectFit: "cover",
            width: "100%",
            height: "100%",
            opacity: 0.3,
            backgroundClip: "padding-box",
            borderRadius: "10px",
            zIndex:2
          }}
        /> */}
      </Card>
    )
  );
}
