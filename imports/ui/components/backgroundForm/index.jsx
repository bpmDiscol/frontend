import React from "react";
import { deleteFile, uploadFile } from "../../misc/filemanagement";
import { Upload, Typography, Flex } from "antd";
import UploadFile from "./uploadCard";
import { getTask, getTaskName } from "../../config/taskManagement";

export default function BackgroundForm({ id }) {
  const { Title } = Typography;
  const [taskId, setTaskId] = React.useState();
  const [currentBackground, setCurrentBackground] = React.useState();

  React.useEffect(() => {
    const taskId = getTaskName() + getTask();
    setTaskId(taskId);
    Meteor.call("get_task_data", taskId, (err, resp) => {
      if (!err && resp?.length) {
        setCurrentBackground(resp[0].backgrounds[`${id}`]);
      }
    });
  }, []);

  return (
    <Flex vertical>
      {id}
      <Title>Antecedentes judiciales</Title>
      {currentBackground && (
        <UploadFile
          currentBackground={currentBackground}
          setCurrentBackground={setCurrentBackground}
          targetField={"policia"}
          title={"Certificado de Policía"}
          id={id}
          taskId={taskId}
        />
      )}
      {currentBackground && (
        <UploadFile
          currentBackground={currentBackground}
          setCurrentBackground={setCurrentBackground}
          targetField={"procuraduria"}
          title={"Certificado de Procuraduría"}
          id={id}
          taskId={taskId}
        />
      )}
       {currentBackground && (
        <UploadFile
          currentBackground={currentBackground}
          setCurrentBackground={setCurrentBackground}
          targetField={"contraloria"}
          title={"Certificado de Contraloría"}
          id={id}
          taskId={taskId}
        />
      )}
    </Flex>
  );
}
