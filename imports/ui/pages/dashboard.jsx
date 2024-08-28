import React, { useEffect, useRef, useState } from "react";

import { Flex } from "antd";
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

  return (
    <Flex vertical style={{ width: "100%" }}>
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
            {requestProcess && approvations && (
              <LeaderTimeLine
                requestProcess={requestProcess}
                approvations={approvations}
              />
            )}
          </OpenToMembership>
        </div>

        <div ref={processCostsRef}>
          <OpenToMembership memberships={[["director", "discol"]]}>
            {requestProcess && approvations && (
              <ProcessCosts
                requestProcess={requestProcess}
                approvations={approvations}
              />
            )}
          </OpenToMembership>
        </div>
        <div ref={requestDashboardRef}>
          <OpenToMembership
            memberships={[
              ["director", "discol"],
              ["Lider", "Gestion_Humana"],
            ]}
          >
            {requestProcess && approvations && (
              <RequestDashboard
                requestProcess={requestProcess}
                approvations={approvations}
              />
            )}
          </OpenToMembership>
        </div>
      </Flex>
    </Flex>
  );
}
