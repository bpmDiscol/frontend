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
    <Flex vertical>
      <Row>
        <Col span={24}>
          <Title level={1}>Espacio de tareas <Text>(Gestiona tu labor en un solo lugar)</Text></Title>
          
        </Col>
      </Row>
      <Row gutter={32}>
        <Col span={8}>
          <TaskList
            title={"Pendientes"}
            filter={"available"}
            buttons={["accept"]}
            resume
            key={availableKey}
            updateList={updateList}
          />
        </Col>
        <Col span={8}>
          <TaskList
            title={"Por hacer"}
            filter={"assigned"}
            buttons={["dismiss", "do"]}
            resume
            key={assignedKey}
            updateList={updateList}
          />
        </Col>
        <Col span={8}>
          <TaskList
            title={"Terminadas"}
            filter={"doneTasks"}
            buttons={[]}
            key={doneKey}
            updateList={updateList}
          />
        </Col>
      </Row>
    </Flex>
  );
}
