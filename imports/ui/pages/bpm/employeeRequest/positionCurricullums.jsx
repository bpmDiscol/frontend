import { Affix, Button, Flex, Input, Select, Space, message } from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { emptySpace } from "../../../misc/emptySpace";
import { fontList } from "../../../misc/fontList";
import { DeleteFilled, FolderAddOutlined } from "@ant-design/icons";
import { deleteFile, uploadFile } from "../../../misc/filemanagement";
import { getCase, getTask, getTaskName } from "../../../config/taskManagement";
import { BlackListCollection } from "../../../../api/blackList/blackListCollection";
import UploadFileButton from "../../../components/uploadFileButton";

export default function PositionCurricullums() {
  const [curricullums, setCurricullums] = React.useState([]);
  const [taskId, setTaskId] = React.useState();
  const [blackListeds, setBlackListeds] = React.useState([]);

  const blackList = useTracker(() => {
    Meteor.subscribe("blackList");
    return BlackListCollection.find({}).fetch();
  });
  React.useEffect(() => {
    const taskId = getTaskName() + getTask();
    setTaskId(taskId);
    Meteor.call("get_task_data", taskId, Meteor.userId(), (err, resp) => {
      if (!err && resp) {
        const response = resp[0];
        if (response?.curricullums)
          setCurricullums(response?.curricullums || []);
        else {
          Meteor.call("get_case", getCase(), Meteor.userId(), (err, resp) => {
            console.log("🚀 ~ curr ~ curr:", resp);
            const curr = resp?.curricullumsInput?.map((curr, ind) => ({
              ...curr,
              file: { uid: curr.fileId, name: "" },
              isSelected: resp.interviewInput[ind].selected,
            }));
            setCurricullums(curr || []);

            if (curr)
              Meteor.callAsync("update_task", {
                taskId,
                field: "curricullums",
                value: curr,
                user: Meteor.userId(),
              }).catch((e) => console.log(e));
          });
        }
      }
    });
  }, []);

  async function updateData(field, value) {
    await Meteor.callAsync("update_task", {
      taskId,
      field,
      value,
      user: Meteor.userId(),
    }).catch((e) => console.log(e));
  }

  async function saveFile(fileData, index) {
    if (fileData) {
      setAttribute("file", { uid: fileData.uid, name: fileData.name }, index);
    } else message.error("No fue posible cargar el archivo");
  }

  function addSpace() {
    const currentCurricullums = [...curricullums, emptySpace];
    setCurricullums(currentCurricullums);
  }

  async function setAttribute(key, value, index) {
    const currentTarget = curricullums[index];
    const newSet = { ...currentTarget, [key]: value };
    const currentCurricullums = [...curricullums];
    currentCurricullums[index] = newSet;
    setCurricullums(currentCurricullums);
    await updateData("curricullums", currentCurricullums);
  }

  function deleteSpace(index) {
    const currentCurricullums = [...curricullums];
    const fileId = currentCurricullums[index].file?.uid;
    currentCurricullums.splice(index, 1);

    if (fileId) deleteFile("curricullums", fileId);
    setCurricullums(currentCurricullums);
    updateData("curricullums", currentCurricullums);
  }

  function addToBlackList(index) {
    setBlackListeds([...blackListeds, index]);
  }
  function removeFromBlacklist(index) {
    setBlackListeds(blackListeds.filter((bl) => !bl == index));
  }

  function isBlackListed(id) {
    if (id) {
      return blackList.filter((bl) => bl.member == id).length;
    }
  }

  return (
    <Flex
      vertical
      gap={16}
      style={{
        width: "100%",
      }}
    >
      <Button
        id="add-curricullum"
        onClick={addSpace}
        style={{ width: "30rem", fontSize: "16px", padding: "0 0 0 20px" }}
        icon={<FolderAddOutlined />}
        type="primary"
      >
        Agregar curriculo
      </Button>
      <Flex
        vertical
        style={{ width: "100%", overflow: "auto", height: "60dvh" }}
      >
        {curricullums?.map((curricullum, index) => {
          return (
            <Flex
              key={index}
              justify="space-between"
              align="start"
              gap={16}
              style={{
                backgroundColor: blackListeds.includes(index)
                  ? "red"
                  : "transparent",
                padding: "5px",
                borderRadius: "10px",
              }}
            >
              <Space.Compact style={{ minWidth: "50vw", width: "60dvw" }}>
                <Input
                  id="applicantName"
                  type="text"
                  placeholder="Cedula"
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    if (isBlackListed(value)) addToBlackList(index);
                    else removeFromBlacklist(index);
                  }}
                />
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
              <Space style={{ width: "15rem", overflow: "hidden" }}>
                <UploadFileButton
                  targetCollection={"curricullums"}
                  onUpload={(uploadData) => saveFile(uploadData, index)}
                  defaultFileShow={
                    curricullum.file
                      ? [{ ...curricullum.file, status: "done" }]
                      : undefined
                  }
                />
              </Space>
              {Object.keys(curricullum).includes("isSelected") && (
                <Flex>
                  {curricullum.isSelected ? "Seleccionado" : "no seleccionado"}
                </Flex>
              )}

              <Button
                id="delete-curricullum"
                onClick={() => deleteSpace(index)}
                iconPosition="end"
                danger
                type="primary"
                icon={<DeleteFilled />}
              ></Button>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}
