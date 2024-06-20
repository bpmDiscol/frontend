import { Button, Flex, Tooltip, notification } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";
import Icon, {
  CloseCircleFilled,
  EditFilled,
  FileAddFilled,
} from "@ant-design/icons";
import { NotificationsContext } from "../../context/notificationsProvider";
import { safeLogOut } from "../../misc/userStatus";
export default function TaskButtons({ buttons = [], updateList, task }) {
  const { setView } = React.useContext(MainViewContext);
  const [loading, setLoading] = React.useState(false);
  const { openNotification } = React.useContext(NotificationsContext);

  function doTask() {
    setView(task.name, { caseId: task.caseId });
  }

  function assignTask(button) {
    Meteor.call(
      "assign_task_to",
      {
        user: buttonData[button].user,
        currentUser: sessionStorage.getItem("constId"),
      },
      (error, resp) => {
        if (error) console.log(error);
        if (resp?.error == "no user") {
          openNotification(
            "error",
            "¡Algo esta mal!",
            "Revisa tus credenciales nuevamente"
          );
          safeLogOut();
        }
        if (resp) console.log(resp);
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
      id: "take-task_button",
    },
    dismiss: {
      label: "Abandonar tarea",
      filters: ["available", "assigned"],
      user: "",
      execute: assignTask,
      icon: CloseCircleFilled,
      id: "undone-task-button",
    },
    do: {
      label: "Realizar tarea",
      execute: doTask,
      icon: EditFilled,
      id: "do-task",
    },
  };

  return (
    <Flex gap={"10px"}>
      {buttons.map((button, index) => {
        return (
          <Tooltip key={index} title={buttonData[button].label}>
            <Button
              id={buttonData[button].id}
              loading={loading}
              onClick={() => {
                setLoading(true);
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
