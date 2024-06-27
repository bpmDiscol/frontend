import React from "react";
import { Typography, Flex, Row, Col } from "antd";
import UploadFile from "./uploadCard";
import { getTask, getTaskName } from "../../config/taskManagement";
import StatusButton from "./statusButton";

import "react-quill/dist/quill.snow.css";
import Notes from "./notes";

import fields from "./fields.json";

export default function CVFilesForm({ id }) {
  const { Title } = Typography;
  const [taskId, setTaskId] = React.useState();
  const [currentCVFiles, setCurrentCVFiles] = React.useState();
  const [key, setNewkey] = React.useState(Math.random());

  React.useEffect(() => {
    const taskId = getTaskName() + getTask();
    setTaskId(taskId);
    Meteor.call("get_task_data", taskId, (err, resp) => {
      if (!err && resp?.length) {
        const bgs = resp[0].cvFiles;
        if (bgs && Object.keys(bgs).includes(id))
          setCurrentCVFiles(bgs[`${id}`]);
        else setCurrentCVFiles({});
      } else setCurrentCVFiles({});
    });
  }, []);

  function setBackground(bg) {
    setCurrentCVFiles(bg);
    setNewkey(Math.random());
  }
  function setNewBackground(value, targetField) {
    const newBg = Object.assign(currentCVFiles || {}, {
      [`${targetField}`]: value,
    });
    setBackground(newBg);
    Meteor.callAsync("update_cv_files", {
      taskId,
      id,
      cvFiles: newBg,
    }).catch((error) => console.log(error));
  }

  return (
    <Flex vertical>
      <Title level={3}>Documentos complementarios</Title>
      <Row gutter={10}>
        <Col xs={24} md={12} lg={8}>
          <Flex
            vertical
            gap={32}
            style={{
              height: "63dvh",
              overflow: "auto",
              border: "1px solid black",
              borderRadius: "10px 0 0 10px",
              padding: "5dvh 1dvw",
              boxShadow: "5px 10px 10px black",
            }}
          >
            {currentCVFiles &&
              fields.map((field, index) => (
                <UploadFile
                  currentCVFiles={currentCVFiles}
                  setCurrentCVFiles={setNewBackground}
                  targetField={field.field}
                  title={field.title}
                  id={id}
                  taskId={taskId}
                  key={key * Math.random() * index}
                />
              ))}
          </Flex>

          {/* <StatusButton
            currentCVFiles={currentCVFiles}
            setCurrentCVFiles={setNewBackground}
            targetField={"status"}
            key={key * Math.random() * 100000}
          /> */}
        </Col>
        <Col xs={24} md={12} lg={16}>
          <Notes
            currentCVFiles={currentCVFiles}
            setCurrentCVFiles={setNewBackground}
            targetField={"health_request"}
          />
        </Col>
      </Row>
    </Flex>
  );
}
