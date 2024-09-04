import { Button, Descriptions, Flex, Modal, Table, Tooltip } from "antd";
import React from "react";
import { MainViewContext } from "../../context/mainViewProvider";
import { NotificationsContext } from "../../context/notificationsProvider";
import { safeLogOut } from "../../misc/userStatus";
import { saveCase, saveTask, saveTaskName } from "../../config/taskManagement";
import { deleteFile } from "../../misc/filemanagement";
import moment from "moment";

export default function TaskButtons({ buttons = [], updateList, task }) {
  console.log("🚀 ~ TaskButtons ~ task:", task);
  const { setView } = React.useContext(MainViewContext);
  const [loading, setLoading] = React.useState(false);
  const { openNotification } = React.useContext(NotificationsContext);
  const [resume, openResume] = React.useState(false);
  const [resumeData, setResumeData] = React.useState();

  function doTask() {
    setView(task.name);
    saveTask(task.id);
    saveCase(task.caseId);
    saveTaskName(task.name);
  }

  async function deleteCurricullumFromTask(taskId) {
    const data = await Meteor.callAsync(
      "get_task_data",
      taskId,
      Meteor.userId()
    );
    if (data?.length) {
      const curricullums = data[0].curricullums || [];
      curricullums.forEach((curr) => {
        deleteFile("curricullums", curr.fileId);
      });
    }
  }

  function assignTask(button) {
    Meteor.call(
      "assign_task_to",
      {
        user: buttonData[button].user,
        currentUser: sessionStorage.getItem("constId"),
        taskId: task.id,
        userId: Meteor.userId(),
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
            deleteCurricullumFromTask(task.name + task.id);
          }
          Meteor.call(
            "delete_task",
            task.name + task.id,
            Meteor.userId(),
            (err) => {
              if (!err) sessionStorage.removeItem("albous");
            }
          );
        }
        updateList(buttonData[button].filters);
      }
    );
  }
  async function watchTask() {
    const caseData = await Meteor.callAsync("get_case", task.caseId).catch(
      () => "case error"
    );
    console.log("🚀 ~ watchTask ~ caseData:", caseData);
    if (caseData !== "case error") {
      Modal.info({
        width: 500,
        title: (
          <Flex justify="space-between">
            <Flex>{task.displayName} </Flex>
            <Flex>{moment(task.archivedDate).format("DD/MM/YYYY")}</Flex>
          </Flex>
        ),
        content: (
          <div>
            {
              <Table
                title={() =>
                  `${caseData.requestEmployeeDataInput.area_proyect} en ${caseData.requestEmployeeDataInput.site}`
                }
                pagination={false}
                bordered
                dataSource={caseData.curricullumsInput?.filter(data=> data.isSelected)}
                rowKey={(data) => data.fileId}
                size="small"
              >
                <Table.Column
                  title={
                    "Candidatos para " +
                    caseData.requestEmployeeDataInput.companyPosition
                  }
                  render={(record) =>
                    `${record.applicantName} ${record.applicantMidname} ${record.applicantLastname}`
                  }
                />
              </Table>
            }
          </div>
        ),
      });
    }
    setLoading(false);
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
    watch: {
      label: "Ver tarea",
      execute: watchTask,
      icon: "FaSolidEye",
      id: "watch-task",
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
