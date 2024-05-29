import { Button, Col, Flex, Form, Input, Row, Select, Space } from "antd";
import React from "react";
import { uploadFile } from "../../../misc/uploadFile";
import { emptySpace } from "../../../misc/emptySpace";
import { fontList } from "../../../misc/fontList";
import { DeleteFilled, FileAddFilled, FilePdfFilled } from "@ant-design/icons";

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
        console.log(currentTask);
        const taskId = "employeeCurriculllums-" + currentTask;
        Meteor.call("get_task_data", taskId, (err, resp) => {
          if (!err) setCurricullums(resp.curricullums);
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
    setCurricullums([...curricullums, emptySpace]);
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
    setCurricullums(currentCurricullums);
    if (fileId) Meteor.call("delete_file", { fileId });
    updateData("curricullums", currentCurricullums);
  }

  return (
    <Flex
      vertical
      style={{
        width: "80%",
        backgroundColor: "aliceblue",
        borderRadius: "10px",
      }}
    >
      {/* <iframe type="application/pdf" src={curricullumLink}>
        Error
      </iframe> */}
      {curricullums &&
        curricullums.map((curricullum, index) => {
          return (
            <Row style={{ padding: "20px" }}>
              <Col span={16}>
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <Space.Compact>
                        <Input
                          id="applicantName"
                          type="text"
                          placeholder="Nombre"
                          value={curricullum?.applicantName}
                          onChange={(e) =>
                            setAttribute(
                              "applicantName",
                              e.currentTarget.value,
                              index
                            )
                          }
                        />
                        <Input
                          id="applicantMiddleName"
                          type="text"
                          placeholder="1er apellido"
                          value={curricullum?.applicantMiddleName}
                          onChange={(e) =>
                            setAttribute(
                              "applicantMiddleName",
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
                              "applicantLastName",
                              e.currentTarget.value,
                              index
                            )
                          }
                        />
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={32}>
                  <Col span={15}>
                    <Form.Item label="Encontrado en:">
                      <Select
                        options={fontList}
                        id="applicantFont"
                        defaultValue={curricullum?.foundBy}
                        onChange={(value) =>
                          setAttribute("foundBy", value, index)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <label style={{ cursor: "pointer" }} for="upload-file">
                      {curricullum?.fileId ? (
                        <Flex
                          id="upload-file-label-uploaded"
                          justify="space-around"
                          align="center"
                          style={{
                            border: "1px solid green",
                            color: "green",
                            padding: "5px 10px",
                            borderRadius: "10px",
                            background: "white",
                          }}
                        >
                          Archivo cargado
                          <FilePdfFilled />
                        </Flex>
                      ) : (
                        <Flex
                          id="upload-file-label-empty"
                          justify="space-around"
                          align="center"
                          style={{
                            border: "1px solid blue",
                            color: "blue",
                            padding: "5px 10px",
                            borderRadius: "10px",
                            background: "white",
                          }}
                        >
                          Cargar Archivo
                          <FileAddFilled />
                        </Flex>
                      )}
                    </label>
                    <input
                      style={{ cursor: "pointer", visibility: "hidden" }}
                      id="upload-file"
                      type="file"
                      onChange={(e) =>
                        saveFile(e.currentTarget.files[0], index)
                      }
                      datatype="application/pdf"
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <Button
                  id="delete-curricullum"
                  onClick={() => deleteSpace(index)}
                  iconPosition="end"
                  icon={<DeleteFilled />}
                >
                  Eliminar registro
                </Button>
              </Col>
            </Row>
          );
        })}
      <Button id="add-curricullum" onClick={addSpace}>
        Agregar curriculo
      </Button>
    </Flex>
  );
}
