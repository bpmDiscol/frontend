import { Button, Flex, Input, Select, Space, message } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";
import { emptySpace } from "../../../misc/emptySpace";
import { fontList } from "../../../misc/fontList";
import {
  DeleteFilled,
  FilePdfFilled,
  FolderAddOutlined,
} from "@ant-design/icons";
import { deleteFile, uploadFile } from "../../../misc/filemanagement";
import { getTask, getTaskName } from "../../../config/taskManagement";

export default function PositionCurricullums() {
  const [curricullums, setCurricullums] = React.useState([]);
  const [taskId, setTaskId] = React.useState();
  React.useEffect(() => {
      const taskId =
        getTaskName() + getTask();
      setTaskId(taskId);
      Meteor.call("get_task_data", taskId, (err, resp) => {
        if (!err && resp) setCurricullums(resp[0].curricullums || []);
      });
    
  }, []);

  function updateData(field, value) {
    Meteor.call("update_task", { taskId, field, value });
  }

  async function saveFile(fileData, index) {
    const currentFile = curricullums[index].fileId;
    if (currentFile) deleteFile("curricullums", currentFile);
    uploadFile("curricullums", fileData, index, (fileId) => {
      if (fileId) setAttribute("fileId", fileId, index);
      else message.error("No fue posible cargar el archivo");
    });
  }

  function addSpace() {
    const currentCurricullums = [...curricullums, emptySpace];
    setCurricullums(currentCurricullums);
  }

  function setAttribute(key, value, index) {
    const currentTarget = curricullums[index];
    const newSet = { ...currentTarget, [key]: value };
    const currentCurricullums = [...curricullums];
    currentCurricullums[index] = newSet;
    setCurricullums(currentCurricullums);
    updateData("curricullums", currentCurricullums);
  }

  function deleteSpace(index) {
    const currentCurricullums = [...curricullums];
    const fileId = currentCurricullums[index].fileId;
    currentCurricullums.splice(index, 1);

    if (fileId) deleteFile("curricullums", fileId);
    setCurricullums(currentCurricullums);
    updateData("curricullums", currentCurricullums);
  }

  return (
    <Flex
      vertical
      gap={16}
      justify="center"
      align="center"
      style={{ padding: "1vw 5vw 0 2vw" }}
    >
      {curricullums &&
        curricullums.map((curricullum, index) => {
          return (
            <Flex key={index} justify="space-between" align="center" gap={16}>
              <Space.Compact style={{ minWidth: "50vw" }}>
                <Input
                  id="applicantName"
                  type="text"
                  placeholder="Nombre"
                  value={curricullum?.applicantName}
                  onChange={(e) =>
                    setAttribute("applicantName", e.currentTarget.value, index)
                  }
                />
                <Input
                  id="applicantMiddleName"
                  type="text"
                  placeholder="1er apellido"
                  value={curricullum?.applicantMidname}
                  onChange={(e) =>
                    setAttribute(
                      "applicantMidname",
                      e.currentTarget.value,
                      index
                    )
                  }
                />
                <Input
                  id="applicantLastName"
                  type="text"
                  placeholder="2do apellido"
                  value={curricullum?.applicantLastname}
                  onChange={(e) =>
                    setAttribute(
                      "applicantLastname",
                      e.currentTarget.value,
                      index
                    )
                  }
                />
                <Select
                  options={fontList}
                  id="applicantFont"
                  defaultValue={
                    curricullum?.foundBy || "Ninguna de las anteriores"
                  }
                  onChange={(value) => setAttribute("foundBy", value, index)}
                />
              </Space.Compact>
              <Space>
                <label
                  style={{ cursor: "pointer" }}
                  for={`upload-file-${index}`}
                >
                  <div
                    id={`upload-file-label-${index}`}
                    gap={16}
                    style={{
                      display: "flex",
                      background: curricullum?.fileId ? "green" : "blue",
                      padding: "5px 15px",
                      borderRadius: "5px",
                      color: "white",
                      minWidth: "10vw",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    {curricullum?.fileId ? "Cargado" : "Cargar"}
                    <FilePdfFilled />
                  </div>
                </label>
                <input
                  style={{ visibility: "hidden", width: 0 }}
                  id={`upload-file-${index}`}
                  type="file"
                  onChange={(e) => saveFile(e.currentTarget.files[0], index)}
                  datatype="application/pdf"
                />
              </Space>

              <Button
                id="delete-curricullum"
                onClick={() => deleteSpace(index)}
                iconPosition="end"
                danger
                type="primary"
                icon={<DeleteFilled />}
              >
                Eliminar registro
              </Button>
            </Flex>
          );
        })}
      <Button
        id="add-curricullum"
        onClick={addSpace}
        style={{ width: "90%", fontSize: "16px" }}
        icon={<FolderAddOutlined />}
        type="primary"
      >
        Agregar curriculo
      </Button>
    </Flex>
  );
}
