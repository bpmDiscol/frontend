import React from "react";
import { Flex } from "antd";

import ProcessTimesChart from "./processTimesChart";
import ProcessCostsChart from "./processCostsTimes";
import ProcessRequests from "./processRequests";

export default function AdminDashboard() {
  const [requestProcess, setRequestProcess] = React.useState();
  const [approvations, setApprovations] = React.useState();
  const [isVisible, setVisible] = React.useState(false);

  async function openVisibility() {
    const memberships = await Meteor.callAsync("get_my_memberships")
      .then((resp) => resp)
      .catch(() => []);
    if (memberships?.length) {
      if (memberships.flat(1).includes("director")) setVisible(true);
    }
  }

  React.useEffect(() => {
    openVisibility();
    Meteor.call("get_requestProcess", (err, requestProcessData) => {
      setRequestProcess(requestProcessData);

      if (!err) {
        Meteor.call(
          "get_approvations",
          requestProcessData,
          (_, approvationsData) => {
            setApprovations(approvationsData);
          }
        );
      }
    });
  }, []);

  return (
    isVisible && (
      <Flex vertical gap={20}>
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
      </Flex>
    )
  );
}
