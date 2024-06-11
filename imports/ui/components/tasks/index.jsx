import { Col, Flex, Row, Typography } from "antd";
import React from "react";
import TaskList from "./taskList";

export default function Tasks() {
  const [availableKey, setAvailableKey] = React.useState(Math.random());
  const [assignedKey, setAssignedKey] = React.useState(Math.random());
  const [doneKey, setDoneKey] = React.useState(Math.random());

  const { Title, Text } = Typography;

  const keyGenerators = {
    available: { run: setAvailableKey },
    assigned: { run: setAssignedKey },
    doneTasks: { run: setDoneKey },
  };

  function updateList(filters) {
    filters?.forEach((filter) => {
      keyGenerators[filter].run(Math.random());
    });
  }

  return (
    <Flex style={{ overflow: "auto" }} gap={16}>
      <Flex style={{width: '30lvw', minWidth:'300px'}}>
        <TaskList
          title={"Pendientes"}
          filter={"available"}
          buttons={["accept"]}
          resume
          key={availableKey}
          updateList={updateList}
        />
      </Flex>
      <Flex style={{width: '30lvw', minWidth:'300px'}}>
        <TaskList
          title={"Por hacer"}
          filter={"assigned"}
          buttons={["dismiss", "do"]}
          resume
          key={assignedKey}
          updateList={updateList}
        />
      </Flex>
      <Flex style={{width: '30lvw', minWidth:'300px'}}>
        <TaskList
          title={"Terminadas"}
          filter={"doneTasks"}
          buttons={[]}
          key={doneKey}
          updateList={updateList}
        />
      </Flex>
    </Flex>
  );
}
