import React from "react";
import { Flex } from "antd";
import { Meteor } from "meteor/meteor";

import ProcessTimesChart from "./processTimesChart";
import ProcessCostsChart from "./processCostsTimes";
import ProcessRequests from "./processRequests";
import Founded from "./founded";

export default function AdminDashboard() {
  const [requestProcess, setRequestProcess] = React.useState();
  const [approvations, setApprovations] = React.useState();
  const [isVisible, setVisible] = React.useState(false);

  async function openVisibility() {
    const roles = [
      ["director", "discol"],
      ["Lider", "Gestion_Humana"],
    ];
    const test = roles.map((role) => {
      return Meteor.callAsync("is_proccess_auth", role, Meteor.userId());
    });
    Promise.all(test)
      .then((permissions) => setVisible(permissions.includes(true)))
      .catch((error) => {
        console.log(error);
      });
  }

  React.useEffect(() => {
    openVisibility();
    Meteor.call(
      "get_requestProcess",
      Meteor.userId(),
      (err, requestProcessData) => {
        setRequestProcess(requestProcessData);

        if (!err) {
          Meteor.call(
            "get_approvations",
            requestProcessData,
            Meteor.userId(),
            (_, approvationsData) => {
              setApprovations(approvationsData);
            }
          );
        }
      }
    );
  }, []);

  return (
    isVisible && (
      <Flex vertical gap={20} style={{ width: "98%" }}>
        {requestProcess && requestProcess && (
          <ProcessRequests
            requestProcess={requestProcess}
            approvations={approvations}
          />
        )}
        {requestProcess && (
          <ProcessCostsChart requestProcess={requestProcess} />
        )}
        {requestProcess && (
          <ProcessTimesChart requestProcess={requestProcess} />
        )}
        <Founded />
      </Flex>
    )
  );
}
