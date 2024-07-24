import React from "react";
import { Flex } from "antd";
import { Meteor } from "meteor/meteor";

import ProcessCostsChart from "./processCostsTimes";

export default function ProcessCosts() {
  const [requestProcess, setRequestProcess] = React.useState();

  React.useEffect(() => {
    Meteor.call(
      "get_requestProcess",
      Meteor.userId(),
      (err, requestProcessData) => {
        setRequestProcess(requestProcessData);
      }
    );
  }, []);

  return (
    <Flex vertical gap={20} style={{ width: "98%" }}>
      {requestProcess && <ProcessCostsChart requestProcess={requestProcess} />}
    </Flex>
  );
}
