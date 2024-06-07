import React from "react";
import { formatDate } from "../../misc/formatDate";
import { Avatar, Card, Collapse, Flex, Tag, Tooltip, Typography } from "antd";

import TaskResume from "./taskResume";
import TaskButtons from "./taskButtons";
const { Meta } = Card;
const { Text } = Typography;

export default function TaskCard({
  task,
  buttons,
  index,
  activeResume,
  setActiveResume,
  resume = false,
  updateList,
  filter,
}) {
  const [requestProcess, setRequestProcess] = React.useState();

  React.useEffect(() => {
    Meteor.call(
      "get_request_process",
      { currentTask: filter == "doneTasks" ? task.sourceObjectId : task.id },
      (error, response) => {
        setRequestProcess(response);
      }
    );
  }, []);
  function setActiveTask() {
    Meteor.call("set_task_id", { taskId: task.id });
  }

  function detectActiveCollapse(e) {
    if (e.length > 0) {
      setActiveResume(index);
    } else setActiveResume(null);
  }

  return (
    <Flex
      gap={16}
      justify="space-between"
      align="center"
      style={{
        width: "90%",
        background: "#2271b1",
        border: "1px solid black",
        padding: "5px 10px",
        borderRadius: "5px",
      }}
      onMouseOver={setActiveTask}
    >
      <Flex vertical justify="space-between">
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {task.displayName}
        </Text>
        <Text
          type="secondary"
          style={{ color: "whitesmoke", fontSize: ".7rem" }}
          italic
        >
          {task.displayDescription}
        </Text>
      </Flex>
      <TaskButtons buttons={buttons} updateList={updateList} task={task} />
    </Flex>
  );
}
