import React from "react";
import { formatDate } from "../../misc/formatDate";
import { Avatar, Card, Collapse, Flex, Tag, Tooltip, Typography } from "antd";
import {
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FieldNumberOutlined,
  UserOutlined,
} from "@ant-design/icons";
import TaskResume from "./taskResume";
import TaskButtons from "./taskButtons";
const { Meta } = Card;

export default function TaskItem({
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


  function detectActiveCollapse(e) {
    if (e.length > 0) {
      setActiveResume(index);
    } else setActiveResume(null);
  }

  return (
    <Card
      hoverable
      style={{ border: "1px solid black" }}
      draggable
    >
      <Meta
        avatar={
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
        }
        title={task.displayName}
        description={task.displayDescription}
      />
      <Flex vertical gap={"small"} style={{ marginTop: "10px" }}>
        <Flex justify="space-between">
          <Tooltip title="Fecha de llegada">
            <Tag
              icon={<ClockCircleOutlined />}
              color="#2db7f5"
              style={{ fontSize: 10 }}
            >
              {formatDate(task.last_update_date)}
            </Tag>
          </Tooltip>
          <Tooltip title="Autor">
            <Tag
              icon={<UserOutlined />}
              color="#3b5999"
              style={{ fontSize: 10, maxWidth: "100px", textOverflow: "..." }}
            >
              {requestProcess?.finisher ? requestProcess?.finisher: "Terminado"}
            </Tag>
          </Tooltip>
          <Tooltip title="Prioridad">
            <Tag
              icon={<ExclamationCircleOutlined />}
              color="#87d068"
              style={{ fontSize: 10 }}
            >
              {task?.priority}
            </Tag>
          </Tooltip>
        </Flex>
        {resume && (
          <Collapse
            onChange={detectActiveCollapse}
            activeKey={activeResume ? 1 : 0}
            style={{ width: "100%" }}
            items={[
              {
                key: "1",
                label: "Resumen",
                children: <TaskResume />,
                extra: (
                  <Tooltip title="Número de proceso">
                    <Tag
                      icon={<FieldNumberOutlined />}
                      style={{ fontSize: 10 }}
                    >
                      {requestProcess?.processId_string}
                    </Tag>
                  </Tooltip>
                ),
              },
            ]}
          />
        )}
        <TaskButtons buttons={buttons} updateList={updateList} task={task} />
      </Flex>
    </Card>
  );
}
