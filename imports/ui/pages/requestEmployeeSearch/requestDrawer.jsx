import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../api/requestEmployeData/requestEmployeeDataPublication";
import { Flex, Tabs } from "antd";
import General from "./general";
import { AuditOutlined, TeamOutlined } from "@ant-design/icons";
import CandidateList from "./candidateList";

export default function RequestDrawer({ drawerData }) {
  const requestEmployee = useTracker(() => {
    Meteor.subscribe("requestEmployee");
    const req = requestEmployeeCollection
      .find({ caseId: drawerData.caseId })
      .fetch();

    if (req.length) {
      const { requestEmployeeDataInput, ...outterData } = req[0];
      const requestEmployee = {
        ...req[0]?.requestEmployeeDataInput,
        ...outterData,
      };
      return requestEmployee;
    }
  });
  const tabs = [
    {
      key: 1,
      label: `General`,
      children: <General requestEmployee={requestEmployee} />,
      icon: <AuditOutlined />,
    },
    {
      key: 2,
      label: `Candidatos [${requestEmployee?.curricullumsInput?.length || 0}]`,
      children: <CandidateList requestEmployee={requestEmployee} />,
      icon: <TeamOutlined />,
    },
  ];

  return (
    <Flex style={{ width: "100%" }}>
      {requestEmployee && <Tabs style={{ width: "100%" }} items={tabs} />}
    </Flex>
  );
}
