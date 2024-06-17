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
    <Flex
      justify="center"
      align="center"
      style={{padding:'3%' }}
      gap={16}
    >
      <TaskList
        title={"Pendientes"}
        filter={"available"}
        buttons={["accept"]}
        resume
        key={availableKey}
        updateList={updateList}
      />
      <TaskList
        title={"Por hacer"}
        filter={"assigned"}
        buttons={["dismiss", "do"]}
        resume
        key={assignedKey}
        updateList={updateList}
      />
      <TaskList
        title={"Terminadas"}
        filter={"doneTasks"}
        buttons={[]}
        key={doneKey}
        updateList={updateList}
      />
    </Flex>
  );
}
