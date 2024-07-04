import { Col, Flex, Row, Typography } from "antd";
import React from "react";
import TaskList from "./taskList";

export default function Tasks() {
  const [availableKey, setAvailableKey] = React.useState(Math.random());
  const [assignedKey, setAssignedKey] = React.useState(Math.random());
  const [doneKey, setDoneKey] = React.useState(Math.random());


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
        title={"Por Hacer"}
        filter={"available"}
        buttons={["accept"]}
        resume
        key={availableKey}
        updateList={updateList}
      />
      <TaskList
        title={"En proceso"}
        filter={"assigned"}
        buttons={["dismiss", "do"]}
        resume
        key={assignedKey}
        updateList={updateList}
      />
      <TaskList
        title={"Completado"}
        filter={"doneTasks"}
        buttons={[]}
        key={doneKey}
        updateList={updateList}
      />
    </Flex>
  );
}
