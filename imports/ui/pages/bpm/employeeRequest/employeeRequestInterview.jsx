import React from "react";
import { Meteor } from "meteor/meteor";
import PositionGereralities from "./positionGereralities";
import PositionVehicle from "./positionVehicle";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";

import { MainViewContext } from "../../../context/mainViewProvider";

import { Button, Flex, Popconfirm, Segmented, Spin, Typography } from "antd";
import { RotateLeftOutlined, SendOutlined } from "@ant-design/icons";
import { safeLogOut } from "../../../misc/userStatus";
import { NotificationsContext } from "../../../context/notificationsProvider";
import PositionInterviews from "./positionInterviews";

import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../../api/requestEmployeData/requestEmployeeDataPublication";
import SpinningLoader from "../../../components/spinningLoader";
import { getCase, getTask, getTaskName } from "../../../config/taskManagement";

import { sonIguales } from "../../../misc/sonIguales";

export default function EmployeeRequestInterview() {
  const { Text, Title } = Typography;
  const { setView, userName } = React.useContext(MainViewContext);
  const { openNotification } = React.useContext(NotificationsContext);

  const [taskChecked, setTaskChecked] = React.useState(false);
  const [tabView, setTabView] = React.useState();
  const [interviews, setInterviews] = React.useState([]);
  const [reload, setReload] = React.useState(false);
  const [waitToSend, setWaitingToSend] = React.useState(false);
  const [warningUsers, setWarningUsers] = React.useState([]);

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
      const value = { taskId };
      requestEmployeeData?.interviewInput?.forEach((iv) => {
        value[iv.interviewId] = iv;
      });
      await Meteor.callAsync("add_task", value, Meteor.userId());
    }
    setTaskChecked(true);
  }

  function reloadPage(index) {
    setTabView(
      <LoadPage
        Component={tabContents[index]}
        data={interviews}
        warningUsers={warningUsers}
      />
    );
  }

  React.useEffect(() => {
    if (!reload && requestEmployeeData) {
      fillTask();
      setReload(true);
      const interviewsPromises = requestEmployeeData?.curricullumsInput?.map(
        (curricullum) => {
          return Meteor.callAsync("getFileLink", {
            id: curricullum.fileId,
            collectionName: "curricullums",
          });
        }
      );
      Promise.all(interviewsPromises)
        .then((values) =>
          values.map((value, index) => {
            const curricullum = requestEmployeeData?.curricullumsInput[index];
            return { ...curricullum, link: value[0].link };
          })
        )
        .then((interviews) => {
          //Guardar data de entrevistas
          setInterviews(interviews);
          //establecer primera vista
          document.getElementById("segmented").scrollTo(1000, 0);
        })
        .catch((e) => console.log(e));
    }
  }, [requestEmployeeData]);

  React.useEffect(() => {
    if (interviews) {
      reloadPage(tabContents.length - 1);
    }
  }, [interviews, warningUsers]);

  function LoadPage({ Component, data, warningUsers }) {
    return (
      <Component
        requestEmployee={requestEmployeeData}
        interviews={data}
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
    { label: "Entrevistas", value: 5 },
  ];
  const tabContents = [
    PositionGereralities,
    PositionVehicle,
    PositionRequirements,
    PositionGears,
    PositionObservations,
    PositionInterviews,
  ];

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "send") return request();
  }

  async function request() {
    setWaitingToSend(true);
    Meteor.call(
      "get_task_data",
      getTaskName() + getTask(),
      Meteor.userId(),
      (err, resp) => {
        if (!err && resp) {
          // const iv = Object.keys(resp[0]).filter((x) => x != "taskId");

          // const interviewIds = requestEmployeeData.curricullumsInput
          //   .filter((data) => data.isSelected)
          //   .map((data) => data.fileId);

          // if (!sonIguales(iv, interviewIds)) {
          //   const diference = interviewIds.filter((x) => !iv.includes(x));
          //   setWarningUsers(diference);
          //   openNotification(
          //     "warning",
          //     "No has terminado aún!!",
          //     "No has visto algunos candidatos. Recuerda que debes llenar todos los campos"
          //   );
          //   setWaitingToSend(false);
          //   return;
          // }

          const savedData = resp[0];
          const req = interviews.map((interview) => {
            return {
              ...savedData[`${interview.fileId}`],
              interviewId: interview.fileId,
            };
          });

          setWaitingToSend(false);
          Meteor.call(
            "send_interviews",
            req,
            getCase(),
            getTask(),
            userName,
            Meteor.userId(),
            (error, response) => {
              setWaitingToSend(false);

              if (error) {
                console.log(error);
                return;
              }
              if (response == "no token") {
                openNotification(
                  "Error",
                  "Algo ha salido mal",
                  "Hubo error del servidor, por favor ingresa nuevamente"
                );
                safeLogOut();
              } else {
                if (!response.error) {
                  Meteor.call(
                    "delete_task",
                    getTaskName() + getTask(),
                    Meteor.userId(),
                    (err) => {
                      if (!err) sessionStorage.removeItem("albous");
                    }
                  );

                  openNotification(
                    "success",
                    "¡Buen trabajo!",
                    "Los archivos se han enviado satisfactoriamente"
                  );
                  setTimeout(() => {
                    setView("tasks");
                  }, 1000);
                }
              }
            }
          );
        }
      }
    );
  }

  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Requisición de personal<Text strong>(Entrevistas)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Flex style={{ overflow: "hidden" }} id="segmented">
          <Segmented
            options={tabTitles}
            defaultValue={tabContents.length - 1}
            onChange={(value) => reloadPage(value)}
            disabled={!requestEmployeeData}
          />
        </Flex>
        <SpinningLoader condition={requestEmployeeData && taskChecked} content={tabView} />
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
    </Flex>
  );
}
