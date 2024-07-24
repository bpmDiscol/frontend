import React from "react";
import { Flex } from "antd";
import { Meteor } from "meteor/meteor";

import ProcessTimesChart from "./processTimesChart";
import ProcessCostsChart from "./processCostsTimes";
import ProcessRequests from "./processRequests";
import Founded from "./founded";

export default function RequestDashboard() {
  const [requestProcess, setRequestProcess] = React.useState();
  const [approvations, setApprovations] = React.useState();

  React.useEffect(() => {
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
    <Flex vertical gap={20} style={{ width: "98%" }}>
      {requestProcess && requestProcess && (
        <ProcessRequests
          requestProcess={requestProcess}
          approvations={approvations}
        />
      )}
      {/* {requestProcess && <ProcessCostsChart requestProcess={requestProcess} />} */}
      {requestProcess && <ProcessTimesChart requestProcess={requestProcess} />}
      <Founded />
    </Flex>
  );
}
