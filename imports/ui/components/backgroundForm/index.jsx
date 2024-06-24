import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { Upload, Typography, Flex, Radio, Form } from "antd";
import UploadFile from "./uploadCard";
import { getTask, getTaskName } from "../../config/taskManagement";
import StatusButton from "./statusButton";

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
        setCurrentBackground(bgs ? bgs[`${id}`] : { status: "rejected" });
      } else setCurrentBackground({ status: "rejected" });
    });
  }, []);

  function setBackground(bg) {
    setCurrentBackground(bg);
    setNewkey(Math.random());
  }
  return (
    <Flex vertical gap={32}>
      <Title level={3}>Antecedentes judiciales</Title>
      {currentBackground && (
        <UploadFile
          currentBackground={currentBackground}
          setCurrentBackground={setBackground}
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
          setCurrentBackground={setBackground}
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
          setCurrentBackground={setBackground}
          targetField={"contraloria"}
          title={"Certificado de Contraloría"}
          id={id}
          taskId={taskId}
          key={key * Math.random() * 100}
        />
      )}

      <StatusButton
        currentBackground={currentBackground}
        setCurrentBackground={setBackground}
        targetField={"status"}
        id={id}
        taskId={taskId}
      />
    </Flex>
  );
}
