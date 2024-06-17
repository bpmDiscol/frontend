import { Button, Flex, Tooltip } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";
import Icon, {
  CloseCircleFilled,
  EditFilled,
  FileAddFilled,
} from "@ant-design/icons";
export default function TaskButtons({ buttons = [], updateList, task }) {
  const { setView } = React.useContext(MainViewContext);
  const [loading, setLoading] = React.useState(false);

  function doTask() {
    setView(task.name, { taskId: task.id });
  }

  function assignTask(button) {
    Meteor.call(
      "assign_task_to",
      { user: buttonData[button].user, taskId: task.id },
      () => {
        updateList(buttonData[button].filters);
      }
    );
  }

  const buttonData = {
    accept: {
      label: "Tomar tarea",
      filters: ["available", "assigned"],
      user: "me",
      execute: assignTask,
      icon: FileAddFilled,
    },
    dismiss: {
      label: "Abandonar tarea",
      filters: ["available", "assigned"],
      user: "",
      execute: assignTask,
      icon: CloseCircleFilled,
    },
    do: {
      label: "Realizar tarea",
      execute: doTask,
      icon: EditFilled,
    },
  };

  return (
    <Flex gap={"10px"}>
      {buttons.map((button, index) => {
        return (
          <Tooltip key={index} title={buttonData[button].label}>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true)
                buttonData[button].execute(button);
              }}
              type="primary"
              shape="circle"
              icon={<Icon component={buttonData[button].icon} />}
            />
          </Tooltip>
        );
      })}
    </Flex>
  );
}
