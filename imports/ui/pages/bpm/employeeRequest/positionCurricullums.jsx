import {
  Affix,
  Button,
  Dropdown,
  Flex,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { emptySpace } from "../../../misc/emptySpace";
import { fontList } from "../../../misc/fontList";
import {
  CaretDownOutlined,
  DeleteFilled,
  FolderAddOutlined,
} from "@ant-design/icons";
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

  function InputField(field, data, index) {
    return (
      <Input
        value={data}
        onChange={(e) => setAttribute(field, e.currentTarget.value, index)}
      />
    );
  }

  function changeSelectable(value, index) {
    setAttribute("isSelected", value.key == "1" ? true : false, index);
  }

  const selectableValues = [
    {
      label: "No seleccionado",
      key: 0,
    },
    {
      label: "Seleccionado",
      key: 1,
    },
  ];

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
      <Flex>
        <Table
          style={{ width: "100%", height: "50dvh" }}
          dataSource={curricullums}
          pagination={false}
          rowKey={(_, index) => index}
        >
          <Table.Column
            title="Cédula"
            dataIndex={"nit"}
            render={(record, _, index) => InputField("nit", record, index)}
          />
          <Table.Column
            title="Nombre"
            dataIndex={"applicantName"}
            render={(record, _, index) =>
              InputField("applicantName", record, index)
            }
          />
          <Table.Column
            title="1er Apellido"
            dataIndex={"applicantMidname"}
            render={(record, _, index) =>
              InputField("applicantMidname", record, index)
            }
          />
          <Table.Column
            title="2do Apellido"
            dataIndex={"applicantLastname"}
            render={(record, _, index) =>
              InputField("applicantLastname", record, index)
            }
          />
          <Table.Column
            title="Encontrado en"
            dataIndex={"foundBy"}
            render={(record, _, index) => (
              <Select
                style={{ width: "10rem" }}
                options={fontList}
                id="applicantFont"
                defaultValue={record || "Ninguna de las anteriores"}
                onChange={(value) => setAttribute("foundBy", value, index)}
              />
            )}
          />
          <Table.Column
            title="Curricullum"
            dataIndex={"file"}
            render={(record, _, index) => (
              <UploadFileButton
                targetCollection={"curricullums"}
                onUpload={(uploadData) => saveFile(uploadData, index)}
                defaultFileShow={
                  record ? [{ ...record.file, status: "done" }] : undefined
                }
              />
            )}
          />
          <Table.Column
            title="Estado"
            dataIndex={"isSelected"}
            render={(value, _, index) =>
              typeof value === "boolean" ? (
                <Dropdown
                  menu={{
                    items: selectableValues,
                    onClick: (select) => changeSelectable(select, index),
                  }}
                >
                  <Tag
                    color="geekblue-inverse"
                    style={{
                      width: "9rem",
                      cursor: "pointer",
                      padding: "5px",
                    }}
                  >
                    {value ? "Seleccionado  " : "No seleccionado  "}
                    <CaretDownOutlined />
                  </Tag>
                </Dropdown>
              ) : (
                <Tag color="geekblue" style={{ width: "100%" }}>
                  Nuevo
                </Tag>
              )
            }
          />
          <Table.Column
            width={"80px"}
            title=""
            dataIndex={"fileId"}
            render={(_, __, index) => (
              <Popconfirm
                title={"¿Borrar el candidato permanentemente?"}
                onConfirm={() => deleteSpace(index)}
              >
                <Button
                  id="delete-curricullum"
                  iconPosition="end"
                  danger
                  type="primary"
                  icon={<DeleteFilled />}
                ></Button>
              </Popconfirm>
            )}
          />
        </Table>
      </Flex>
    </Flex>
  );
}
