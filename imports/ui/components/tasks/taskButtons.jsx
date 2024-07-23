import { Button, Flex, Tooltip } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";
import { NotificationsContext } from "../../context/notificationsProvider";
import { safeLogOut } from "../../misc/userStatus";
import { saveCase, saveTask, saveTaskName } from "../../config/taskManagement";
import { deleteFile } from "../../misc/filemanagement";
export default function TaskButtons({ buttons = [], updateList, task }) {
  const { setView } = React.useContext(MainViewContext);
  const [loading, setLoading] = React.useState(false);
  const { openNotification } = React.useContext(NotificationsContext);

  function doTask() {
    setView(task.name);
    saveTask(task.id);
    saveCase(task.caseId);
    saveTaskName(task.name);
  }

  async function deleteCurricullumFromTask(taskId) {
    const data = await Meteor.callAsync("get_task_data", taskId, Meteor.userId(), );
    if (data?.length) {
      const curricullums = data[0].curricullums || [];
      curricullums.forEach((curr) => {
        deleteFile("curricullums", curr.fileId);
      });
      //TODO: borrar backgrounds
      //const backgrounds = data[0].backgrounds ||[]
      //backgrounds.forEach(bg => deleteFile('backgrounds', bg._id))
    }
  }

  function assignTask(button) {
    Meteor.call(
      "assign_task_to",
      {
        user: buttonData[button].user,
        currentUser: sessionStorage.getItem("constId"),
        taskId: task.id,
        userId: Meteor.userId()
      },
      (error, resp) => {
        if (error) {
          return;
        }
        if (resp?.error == "no user") {
          openNotification(
            "error",
            "¡Algo esta mal!",
            "Revisa tus credenciales nuevamente"
          );
          safeLogOut();
          return;
        }
        if (resp) {
          if (buttonData[button].user == "") {
            // TODO: cambiar nombre a deleteTemporaryFiles
            deleteCurricullumFromTask(task.name + task.id);
          }
          Meteor.call("delete_task", task.name + task.id, Meteor.userId(), (err) => {
            if (!err) sessionStorage.removeItem("albous");
          });
        }
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
      icon: "transferRight",
      id: "take-task_button",
    },
    dismiss: {
      label: "Abandonar tarea",
      filters: ["available", "assigned"],
      user: "",
      execute: assignTask,
      icon: "transferLeft",
      id: "undone-task-button",
    },
    do: {
      label: "Realizar tarea",
      execute: doTask,
      icon: "playActivity",
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
              type="default"
              shape="circle"
              icon={
                <img
                  src={`/icons/${buttonData[button].icon}.svg`}
                  style={{ width: "25px" }}
                />
              }
            />
          </Tooltip>
        );
      })}
    </Flex>
  );
}
