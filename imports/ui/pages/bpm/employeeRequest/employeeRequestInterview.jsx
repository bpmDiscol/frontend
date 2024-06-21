import React from "react";
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

export default function EmployeeRequestInterview() {
  const { Text, Title } = Typography;
  const { setView, userName } = React.useContext(MainViewContext);
  const { openNotification } = React.useContext(NotificationsContext);

  const [tabView, setTabView] = React.useState();
  const [interviews, setInterviews] = React.useState([]);
  const [reload, setReload] = React.useState(false);
  const [waitToSend, setWaitingToSend] = React.useState(false);

  const requestEmployeeData = useTracker(() => {
    Meteor.subscribe("requestEmployee");
    const req = requestEmployeeCollection
      .find({ caseId: getCase() })
      .fetch();

    if (req.length) {
      const { requestEmployeeDataInput, ...outterData } = req[0];
      const requestEmployee = {
        ...req[0]?.requestEmployeeDataInput,
        ...outterData,
      };
      return requestEmployee;
    }
  });

  React.useEffect(() => {
    if (!reload && requestEmployeeData) {
      setReload(true);
      const interviewsPromises = requestEmployeeData?.curricullumsInput?.map(
        (curricullum) => {
          return Meteor.callAsync("getFileLink", {
            id: curricullum.fileId,
            collectionName: "curricullums",
          }).catch(error=> console.error(error));
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
          setTabView(
            <LoadPage
              Component={tabContents[tabContents.length - 1]}
              data={interviews}
            />
          );
          document.getElementById("segmented").scrollTo(1000, 0);
        });
    }
  }, [requestEmployeeData]);

  function LoadPage({ Component, data }) {
    return (
      <Component requestEmployee={requestEmployeeData} interviews={data} />
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
      (err, resp) => {
        if (!err && resp.length) {
          const savedData = resp[0];
          const req = interviews.map((interview) => {
            return {
              ...savedData[`interview-${interview.fileId}`],
              interviewId: interview.fileId,
            };
          });

          Meteor.call("send_interviews", req, getCase(), getTask(), userName, (error, response) => {
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
                Meteor.call("delete_task", getTaskName() + getTask(), (err) => {
                  if (!err) sessionStorage.removeItem("albous");
                });
                setView("tasks");
                openNotification(
                  "success",
                  "¡Buen trabajo!",
                  "Los archivos se han enviado satisfactoriamente"
                );
              }
            }
          });
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
        <Flex style={{ overflow: "auto" }} id="segmented">
          <Segmented
            options={tabTitles}
            defaultValue={tabContents.length - 1}
            onChange={(value) =>
              setTabView(
                <LoadPage Component={tabContents[value]} data={interviews} />
              )
            }
          />
        </Flex>
        <SpinningLoader condition={requestEmployeeData} content={tabView} />
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
