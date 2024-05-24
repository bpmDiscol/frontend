import { Button, Flex } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";

export default function TaskButtons({ buttons = [], updateList, task }) {
  const { setView } = React.useContext(MainViewContext);

  function doTask() {
    setView(task.name, { taskId: task.id });
  }

  function assignTask(button) {
    Meteor.call("assign_task_to", { user: buttonData[button].user });
    updateList(buttonData[button].filters);
  }

  const buttonData = {
    accept: {
      label: "Tomar tarea",
      filters: ["available", "assigned"],
      user: "me",
      execute: assignTask,
    },
    dismiss: {
      label: "Abandonar tarea",
      filters: ["available", "assigned"],
      user: "",
      execute: assignTask,
    },
    do: {
      label: "Realizar tarea",
      execute: doTask,
    },
  };

  return (
    <Flex gap={'10px'}>
      {buttons.map((button, index) => {
        return (
          <Button
            key={index}
            onClick={() => buttonData[button].execute(button)}
            type="primary"
            block
          >
            {buttonData[button].label}
          </Button>
        );
      })}
    </Flex>
  );
}
