import { Button, Flex, Input, Select, Space } from "antd";
import React from "react";
import { uploadFile } from "../../../misc/uploadFile";
import { emptySpace } from "../../../misc/emptySpace";
import { fontList } from "../../../misc/fontList";
import {
  DeleteFilled,
  FilePdfFilled,
  FolderAddOutlined,
} from "@ant-design/icons";

export default function PositionCurricullums() {
  const [curricullums, setCurricullums] = React.useState([]);

  //   const curr = useTracker(() => {
  //     Meteor.subscribe("curricullums");
  //     return curricullumCollection.find().fetch();
  //   });
  //   React.useEffect(() => {
  //     Meteor.call("get_file_link", { id: "Ch6pB8FmiTXBMN7iJ" }, (err, res) => {
  //       if (err) console.log(err);
  //       else setCurricullumLink(res[0].link);
  //     });
  //   }, []);

  React.useEffect(() => {
    Meteor.call("get_task_id", (err, currentTask) => {
      if (!err) {
        const taskId = "employeeCurriculllums-" + currentTask;
        Meteor.call("get_task_data", taskId, (err, resp) => {
          if (!err) setCurricullums(resp?.curricullums || []);
        });
      }
    });
  }, []);

  function updateData(field, value) {
    Meteor.call("get_task_id", (Err, currentTask) => {
      const taskId = "employeeCurriculllums-" + currentTask;
      Meteor.call("update_task", { taskId, field, value });
    });
  }

  function saveFile(fileData, index) {
    uploadFile(fileData, index, setAttribute);
  }

  //   TODO: status message
  //   function showMessage(msg, type){
  //     if(type== "error") message.error(msg)
  //     if(type == "success") message.success(msg)
  //   }

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

    if (fileId) Meteor.call("delete_file", { fileId });
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
      {/* <iframe type="application/pdf" src={curricullumLink}>
        Error
      </iframe> */}
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
                  value={curricullum?.applicantMiddleName}
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
                  value={curricullum?.applicantLastName}
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
                  <Flex
                    id={`upload-file-label-${index}`}
                    justify="space-between"
                    align="center"
                    gap={16}
                    style={{
                      background: curricullum?.fileId ? "green" : "blue",
                      padding: "5px 15px",
                      borderRadius: "5px",
                      color: "white",
                      minWidth: "10vw",
                    }}
                  >
                    {curricullum?.fileId ? "Cargado" : "Cargar"}
                    <FilePdfFilled />
                  </Flex>
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
