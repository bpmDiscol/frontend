import React from "react";
import { formatDate } from "../../misc/formatDate";
import { Flex, Tooltip, Typography } from "antd";

import TaskButtons from "./taskButtons";
const { Text } = Typography;

export default function TaskCard({ task, buttons, updateList }) {
  

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
    >
      <Flex justify="space-between" align="center">
        <Tooltip title={`Prioridad: ${task?.priority}`}>
          <Flex
            style={{
              height: "5px",
              width: "100px",
              background: "#3af271",
              borderRadius: "5px",
            }}
          >
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
