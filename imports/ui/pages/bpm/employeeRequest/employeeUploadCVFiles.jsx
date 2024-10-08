import React from "react";
import PositionGereralities from "./positionGereralities";
import PositionVehicle from "./positionVehicle";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";

import { MainViewContext } from "../../../context/mainViewProvider";

import {
  Button,
  Flex,
  Modal,
  Popconfirm,
  Result,
  Segmented,
  Typography,
} from "antd";
import { RotateLeftOutlined, SendOutlined } from "@ant-design/icons";
import { safeLogOut } from "../../../misc/userStatus";
import { NotificationsContext } from "../../../context/notificationsProvider";
import SpinningLoader from "../../../components/spinningLoader";

import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../../api/requestEmployeData/requestEmployeeDataPublication";
import { getCase, getTask, getTaskName } from "../../../config/taskManagement";
import { sonIguales } from "../../../misc/sonIguales";
import PositionUploadCVFiles from "./positionuploadCVFiles";
import cvFields from "../data/cvfields.json";
import optionalCVFields from "../data/optionalCVFields.json";
import { arrayDifference } from "../../../misc/arrayDifference";

export default function EmployeeUploadCVFiles() {
  const { Text, Title } = Typography;
  const { setView, userName } = React.useContext(MainViewContext);
  const { openNotification } = React.useContext(NotificationsContext);
  const [tabView, setTabView] = React.useState();

  const [waitToSend, setWaitingToSend] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [curricullums, setCurricullums] = React.useState([]);
  const [warningUsers, setWarningUsers] = React.useState([]);
  const [warningMessage, setWarningMessage] = React.useState(false);
  const [taskChecked, setTaskChecked] = React.useState(false);

  const requestEmployeeData = useTracker(() => {
    Meteor.subscribe("requestEmployee");
    const req = requestEmployeeCollection.find({ caseId: getCase() }).fetch();

    if (req.length) {
      const { requestEmployeeDataInput, ...outterData } = req[0];
      const requestEmployee = {
        ...req[0]?.requestEmployeeDataInput,
        ...outterData,
      };
      return requestEmployee;
    }
  });
  async function fillTask() {
    const taskId = getTaskName() + getTask();
    const existTask = await Meteor.callAsync(
      "exist_task",
      taskId,
      Meteor.userId()
    );
    if (!existTask) {
      const value = { ...requestEmployeeData?.cvFilesInput };
      await Meteor.callAsync(
        "add_task",
        { taskId, cvFiles: value },
        Meteor.userId()
      );
    }
    setTaskChecked(true);
  }

  function reloadPage(index) {
    setTabView(
      <LoadPage
        Component={tabContents[index]}
        curricullums={curricullums}
        interviews={requestEmployeeData?.interviewInput}
        warningUsers={warningUsers}
      />
    );
  }
  React.useEffect(() => {
    if (!reload && requestEmployeeData) {
      fillTask();
      setReload(true);
      const curricullums = requestEmployeeData?.curricullumsInput?.map(
        async (curricullum) => {
          try {
            return await Meteor.callAsync("getFileLink", {
              id: curricullum.fileId,
              collectionName: "curricullums",
            });
          } catch (error) {
            return console.error(error);
          }
        }
      );

      Promise.all(curricullums)
        .then((values) =>
          values.map((value, index) => {
            const curricullum = requestEmployeeData?.curricullumsInput[index];
            return { ...curricullum, link: value[0].link };
          })
        )
        .then((curricullums) => {
          //Guardar data de entrevistas
          setCurricullums(curricullums);
          //establecer primera vista
          document.getElementById("segmented").scrollTo(1000, 0);
        });
    }
  }, [requestEmployeeData]);

  React.useEffect(() => {
    if (curricullums) {
      reloadPage(tabContents.length - 1);
    }
  }, [curricullums, warningUsers]);

  function LoadPage({ Component, curricullums, interviews, warningUsers }) {
    return (
      <Component
        requestEmployee={requestEmployeeData}
        curricullums={curricullums}
        interviews={interviews}
        warningUsers={warningUsers}
      />
    );
  }

  const tabTitles = [
    { label: "Datos del cargo", value: 0 },
    { label: "Vehiculo", value: 1 },
    { label: "Requerimientos", value: 2 },
    { label: "Equipo necesario", value: 3 },
    { label: "Observaciones", value: 4 },
    { label: "Antecedentes", value: 5 },
  ];
  const tabContents = [
    PositionGereralities,
    PositionVehicle,
    PositionRequirements,
    PositionGears,
    PositionObservations,
    PositionUploadCVFiles,
  ];

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "send") return handleBeforeSend();
  }

  function handleBeforeSend() {
    const taskId = getTaskName() + getTask();
    Meteor.call("get_task_data", taskId, Meteor.userId(), (err, resp) => {
      if (!err && resp?.length) {
        if (!resp[0].cvFiles) {
          openNotification(
            "error",
            "No se ha cargado nada 😒",
            "Al parecer no has hecho ningun cambio en la petición. Debes tener alguna interacción con los campos antes de enviar"
          );
          return;
        }
        request();
        // const cv = Object.keys(resp[0].cvFiles);
        // const interviewIds = requestEmployeeData.interviewInput
        //   .filter((data) => data.selected)
        //   .map((data) => data.interviewId);
        // if (!sonIguales(cv, interviewIds)) {
        //   const diference = interviewIds.filter((x) => !cv.includes(x));

        //   setWarningUsers(diference);
        //   openNotification(
        //     "warning",
        //     "No has terminado aún!!",
        //     "No has visto algunos candidatos. Recuerda que debes cargar los documentos que tengas disponibles"
        //   );
        //   return;
        // }

        // const warningUsers = cv
        //   .map((cvId) => {
        //     const cvKeys = Object.keys(resp[0].cvFiles[cvId]);
        //     if (
        //       !sonIguales(
        //         arrayDifference(cvKeys, optionalCVFields),
        //         arrayDifference(cvFields, optionalCVFields)
        //       )
        //     )
        //       return cvId;
        //     else {
        //       const values = cvKeys
        //         .map((cvKey) => resp[0].cvFiles[cvId][cvKey] == null)
        //         .filter((result) => result);
        //       if (values.some((value) => value == true)) return cvId;
        //     }
        //   })
        //   .filter((val) => val);
        // if (warningUsers.length) {
        //   setWarningUsers(warningUsers);
        //   setWarningMessage(true);
        // } else request();
      }
    });
  }

  function request() {
    setWaitingToSend(true);
    const taskId = getTaskName() + getTask();
    Meteor.call("get_task_data", taskId, Meteor.userId(), (err, resp) => {
      if (!err && resp?.length) {
        const cvs = resp[0].cvFiles;
        const healthRequests = Object.keys(cvs).map((key) => {
          candiateCurricullum = curricullums.filter(
            (curr) => curr.fileId == key
          )[0];
          candidateProfile = requestEmployeeData?.interviewInput.filter(
            (data) => data.interviewId == key
          )[0];
          return {
            health_requirements: cvs[key].health_request || "No requerido",
            candidate_name:
              `${candiateCurricullum.applicantName} ${candiateCurricullum.applicantMidname} ${candiateCurricullum.applicantLastname}`.toUpperCase(),
            candidate_id: candidateProfile.id,
          };
        });

        Meteor.call(
          "uploadCVfiles",
          cvs,
          healthRequests,
          getCase(),
          getTask(),
          userName,
          Meteor.userId(),
          (err, res) => {
            setWaitingToSend(false);
            if (err) console.log(err);
            if (res == "no token") {
              openNotification(
                "Error",
                "Algo ha salido mal",
                "Hubo error del servidor, por favor ingresa nuevamente"
              );
              safeLogOut();
            } else {
              if (!res.error) {
                Meteor.call("delete_task", taskId, Meteor.userId());
                setTimeout(() => {
                  setView("tasks");
                }, 1000);
                openNotification(
                  "success",
                  "¡Buen trabajo!",
                  "Los archivos se han enviado satisfactoriamente"
                );
              }
            }
          }
        );
      }
    });
  }

  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Requisición de personal
          <Text strong>(Documentos complementarios)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Flex style={{ overflow: "auto" }} id="segmented">
          <Segmented
            options={tabTitles}
            defaultValue={tabContents.length - 1}
            onChange={(value) => reloadPage(value)}
            disabled={!requestEmployeeData}
          />
        </Flex>
        <SpinningLoader
          condition={requestEmployeeData && taskChecked}
          content={tabView}
        />
      </Flex>
      <Flex id="horizontal-buttons" gap={"10px"}>
        <Button
          type="primary"
          onClick={() => handleButtonResponses("return")}
          icon={<RotateLeftOutlined />}
          id="return-button"
        >
          Regresar
        </Button>

        <Popconfirm
          title="¿Enviar entrevistas?"
          onConfirm={() => handleButtonResponses("send")}
          okText="Por supuesto"
          cancelText="Déjame pensarlo"
        >
          <Button
            loading={waitToSend}
            type="primary"
            danger
            icon={<SendOutlined />}
            iconPosition="end"
            id="approve-button"
          >
            Enviar
          </Button>
        </Popconfirm>
      </Flex>
      <Modal
        title="🟡Espera un momento..."
        closable={true}
        onCancel={() => setWarningMessage(false)}
        open={warningMessage}
        onOk={() => setWarningMessage(false)}
        // confirmLoading={confirmLoading}
        footer={[
          <Button onClick={() => request()} key="send">
            Enviar de todas formas
          </Button>,
          <Button
            type="primary"
            style={{ marginTop: "1rem" }}
            onClick={() => setWarningMessage(false)}
            key="wait"
          >
            Revisar antes de proceder
          </Button>,
        ]}
      >
        <Result
          status="warning"
          title="Algunos archivos no han sido cargados"
        />
      </Modal>
    </Flex>
  );
}
