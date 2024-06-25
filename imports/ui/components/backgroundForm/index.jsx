import React from "react";
import { Typography, Flex, Row, Col } from "antd";
import UploadFile from "./uploadCard";
import { getTask, getTaskName } from "../../config/taskManagement";
import StatusButton from "./statusButton";

import "react-quill/dist/quill.snow.css";
import Notes from "./notes";

export default function BackgroundForm({ id }) {
  const { Title } = Typography;
  const [taskId, setTaskId] = React.useState();
  const [currentBackground, setCurrentBackground] = React.useState();
  const [key, setNewkey] = React.useState(Math.random());

  React.useEffect(() => {
    const taskId = getTaskName() + getTask();
    setTaskId(taskId);
    Meteor.call("get_task_data", taskId, (err, resp) => {
      if (!err && resp?.length) {
        const bgs = resp[0].backgrounds;
        if (bgs && Object.keys(bgs).includes(id))
          setCurrentBackground(bgs[`${id}`]);
        else setCurrentBackground({ status: "rejected" });
      } else setCurrentBackground({ status: "rejected" });
    });
  }, []);

  function setBackground(bg) {
    setCurrentBackground(bg);
    setNewkey(Math.random());
  }
  function setNewBackground(value, targetField) {
    const newBg = Object.assign(currentBackground || {}, {
      [`${targetField}`]: value,
    });
    setBackground(newBg);
    Meteor.callAsync("update_backgrounds", {
      taskId,
      id,
      backgroundFiles: newBg,
    }).catch((error) => console.log(error));
  }

  return (
    <Flex vertical>
      <Title level={3}>Antecedentes judiciales</Title>
      <Row gutter={10}>
        <Col xs={24} md={12} lg={8}>
          <Flex vertical gap={32}>
            {currentBackground && (
              <UploadFile
                currentBackground={currentBackground}
                setCurrentBackground={setNewBackground}
                targetField={"policia"}
                title={"Certificado de Policía"}
                id={id}
                taskId={taskId}
                key={key * Math.random() * 100}
              />
            )}
            {currentBackground && (
              <UploadFile
                currentBackground={currentBackground}
                setCurrentBackground={setNewBackground}
                targetField={"procuraduria"}
                title={"Certificado de Procuraduría"}
                id={id}
                taskId={taskId}
                key={key * Math.random() * 100}
              />
            )}
            {currentBackground && (
              <UploadFile
                currentBackground={currentBackground}
                setCurrentBackground={setNewBackground}
                targetField={"contraloria"}
                title={"Certificado de Contraloría"}
                key={key * Math.random() * 100}
              />
            )}

            <StatusButton
              currentBackground={currentBackground}
              setCurrentBackground={setNewBackground}
              targetField={"status"}
              key={key * Math.random() * 100000}
            />
          </Flex>
        </Col>
        <Col xs={24} md={12} lg={16}>
          {currentBackground && (
            <Notes
              currentBackground={currentBackground}
              setCurrentBackground={setNewBackground}
              targetField={"notes"}
            />
          )}
        </Col>
      </Row>
    </Flex>
  );
}
