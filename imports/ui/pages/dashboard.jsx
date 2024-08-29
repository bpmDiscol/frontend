import React, { useEffect, useRef, useState } from "react";

import { Flex, Spin } from "antd";
import OpenToMembership from "../components/openToMembership";
import RequestDashboard from "../components/RequestDashboard";
import ProcessCosts from "../components/RequestDashboard/ProcessCosts";
import LeaderTimeLine from "../components/RequestDashboard/leaderTimeLine";

export default function Dashboard() {
  const targetRef = useRef();
  const lineInfoRef = useRef();
  const processCostsRef = useRef();
  const requestDashboardRef = useRef();

  const [requestProcess, setRequestProcess] = useState();
  const [approvations, setApprovations] = useState();

  useEffect(() => {
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
  console.log({ requestProcess, approvations });

  return (
    <Flex vertical style={{ width: "100%" }}>
      {!requestProcess && !approvations && (
        <Spin fullscreen tip="Recolectando datos..." />
      )}
      {requestProcess && approvations && (
        <Flex
          vertical
          gap={16}
          style={{
            padding: "0 0 20px 20px",
            backgroundColor: "#F0F2F5",
            width: "100%",
            overflow: "auto",
          }}
          ref={targetRef}
        >
          <div ref={lineInfoRef}>
            <OpenToMembership memberships={[["Lider"]]}>
              <LeaderTimeLine
                requestProcess={requestProcess}
                approvations={approvations}
              />
            </OpenToMembership>
          </div>

          <div ref={processCostsRef}>
            <OpenToMembership memberships={[["director", "discol"]]}>
              <ProcessCosts
                requestProcess={requestProcess}
                approvations={approvations}
              />
            </OpenToMembership>
          </div>
          <div ref={requestDashboardRef}>
            <OpenToMembership
              memberships={[
                ["director", "discol"],
                ["Lider", "Gestion_Humana"],
              ]}
            >
              <RequestDashboard
                requestProcess={requestProcess}
                approvations={approvations}
              />
            </OpenToMembership>
          </div>
        </Flex>
      )}
    </Flex>
  );
}
