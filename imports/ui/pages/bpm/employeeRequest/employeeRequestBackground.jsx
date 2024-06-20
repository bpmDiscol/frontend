import React from "react";
import PositionGereralities from "./positionGereralities";
import PositionVehicle from "./positionVehicle";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";

import { MainViewContext } from "../../../context/mainViewProvider";

import {
  Button,
  Empty,
  Flex,
  Popconfirm,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { RotateLeftOutlined, SendOutlined } from "@ant-design/icons";
import { safeLogOut } from "../../../misc/userStatus";
import { NotificationsContext } from "../../../context/notificationsProvider";
import PositionInterviews from "./positionInterviews";
import PositionBackgroud from "./positionBackground";
import SpinningLoader from "../../../components/spinningLoader";
import { get_file_link } from "../../../misc/filemanagement";

import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../../api/requestEmployeData/requestEmployeeDataPublication";

export default function EmployeeRequestBackground({ caseId }) {
  const { Text, Title } = Typography;
  const { setView } = React.useContext(MainViewContext);
  const { openNotification } = React.useContext(NotificationsContext);
  const [tabView, setTabView] = React.useState();

  const [waitToSend, setWaitingToSend] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [curricullums, setCurricullums] = React.useState([]);
  const [interviews, setInterviews] = React.useState([]);

  const requestEmployeeData = useTracker(() => {
    Meteor.subscribe("requestEmployee");
    const req = requestEmployeeCollection
      .find({ caseId: parseInt(caseId) })
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
      const curricullums = requestEmployeeData?.curricullumsInput?.map(
        (curricullum) => {
          return Meteor.callAsync("getFileLink", {
            id: curricullum.fileId,
            collectionName: "curricullums",
          });
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
          setTabView(
            <LoadPage
              Component={tabContents[0]}
              curricullums={curricullums}
              interviews={requestEmployeeData.interviewInput}
            />
          );
          document.getElementById("segmented").scrollTo(1000, 0);
        });
    }
  }, [requestEmployeeData]);

  function LoadPage({ Component, curricullums, interviews }) {
    return (
      <Component
        requestEmployee={requestEmployeeData}
        curricullums={curricullums}
        interviews={interviews}
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
    PositionBackgroud,
  ];

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "send") return request();
  }

  function request() {
    Meteor.call("get_task_data", myTaskId, (err, resp) => {
      if (!err && resp.length) {
        const savedData = resp[0];
        const req = interviews.map((interview) => {
          return {
            ...savedData[`interview-${interview.fileId}`],
            interviewId: interview.fileId,
          };
        });

        Meteor.call("send_interviews", req, sessionStorage.getItem('constId'), (error, response) => {
          if (error) {
            console.log(error);
            return;
          }
          console.log(response);
          if (response == "no token") {
            openNotification(
              "Error",
              "Algo ha salido mal",
              "Hubo error del servidor, por favor ingresa nuevamente"
            );
            safeLogOut();
          } else {
            if (!response.error) {
              Meteor.call("delete_task", myTaskId);
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
    });
  }

  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Requisición de personal<Text strong>(Antecedentes)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Flex style={{ overflow: "auto" }} id="segmented">
          <Segmented
            options={tabTitles}
            defaultValue={0}
            onChange={(value) =>
              setTabView(
                <LoadPage
                  Component={tabContents[value]}
                  curricullums={curricullums}
                  interviews={requestEmployeeData.interviewInput}
                />
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
