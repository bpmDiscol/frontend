import React from "react";
import { formatDate } from "../../misc/formatDate";
import { Avatar, Card, Collapse, Flex, Tag, Tooltip, Typography } from "antd";

import TaskResume from "./taskResume";
import TaskButtons from "./taskButtons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
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
      vertical
      style={{
        width: "90%",
        background: "#2271b1",
        border: "1px solid black",
        padding: "5px 10px",
        borderRadius: "5px",
      }}
      onMouseOver={setActiveTask}
    >
      <Flex justify="space-between" align="center">
        <Tooltip title={`Prioridad: ${task?.priority}`}>
          <Flex style={{ height: "5px", width: "100px", background: "#3af271", borderRadius:'5px' }}>
            {" "}
          </Flex>
        </Tooltip>

        <Text style={{ fontSize: 10, textAlign: "end", color: "white" }}>
          {formatDate(task.last_update_date)}
        </Text>
      </Flex>
      <Flex style={{ width: "100%" }} justify="space-between" align="center">
        <Flex vertical>
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
    </Flex>
  );
}
