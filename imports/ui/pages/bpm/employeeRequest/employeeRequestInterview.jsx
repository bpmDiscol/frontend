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

const { Text, Title } = Typography;
export default function EmployeeRequestInterview() {
  const [requestEmployeeData, setRequestEmployeeData] = React.useState();
  const [requestEmployee, setRequestEmployee] = React.useState();
  const { setView } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [loaded, setLoaded] = React.useState(false);
  const [myTaskId, setMyTaskId] = React.useState();
  const [interviewData, setInterviewData] = React.useState([]);
  const [interviews, setInterviews] = React.useState([]);

  const { openNotification } = React.useContext(NotificationsContext);

  function getInterviewData() {
    return interviewData;
  }

  React.useEffect(() => {
    Meteor.callAsync("get_employee_request").then((response) => {
      setRequestEmployee(response);
      Meteor.call(
        "request_data_links",
        {
          requestLinks: response.links,
        },
        (error, response) => {
          if (!error) {
            setRequestEmployeeData(response);
          }
        }
      );
    });

    document.getElementById("segmented").scrollTo(1000, 0);
  }, []);

  React.useEffect(() => {
    Meteor.callAsync("get_curricullums").then((response) => {
      if (response == "error") {
        openNotification(
          "error",
          "Error Critico",
          "Los datos que se solicitados no estan disponibles o se encuentran dañados"
        );
        return;
      }
      let tempInterviews = [];
      response.forEach(async (curricullum) => {
        Meteor.call(
          "get_file_link",
          { id: curricullum.fileId },
          (err, resp) => {
            if (!err) {
              tempInterviews.push({ ...curricullum, link: resp[0]?.link });
            }
          }
        );
      });
      setInterviews(tempInterviews);
    });
  }, []);

  React.useEffect(() => {
    requestEmployee && requestEmployeeData && setLoaded(true);
  }, [requestEmployee, requestEmployeeData]);

  React.useEffect(() => {
    loaded &&
      setTabView(<LoadPage Component={tabContents[tabContents.length - 1]} />);
  }, [loaded]);

  function setReload() {
    Meteor.call("get_task_id", (err, currentTask) => {
      if (!err) {
        const taskId = "employeeInterview-" + currentTask;
        setMyTaskId(taskId);
        Meteor.call("get_task_data", taskId, (err, resp) => {
          if (!err) setInterviewData(resp[0] || []);
        });
      }
    });
  }

  React.useEffect(() => setReload(), []);

  async function updateData(field, value) {
    await Meteor.callAsync("update_task", { taskId: myTaskId, field, value });
  }

  function LoadPage({ Component }) {
    return (
      <Component
        requestEmployee={requestEmployee}
        requestEmployeeData={requestEmployeeData}
        update={updateData}
        interviewData={interviewData}
        interviews={interviews}
        getInterviewData={getInterviewData}
        setReload={setReload}
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

        Meteor.call("send_interviews", req, (error, response) => {
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
                <LoadPage Component={tabContents[value]} />
              )
            }
          />
        </Flex>
        <Flex vertical style={{ height: "50lvh", overflowY: "auto" }}>
          {requestEmployee && requestEmployeeData && tabView}
        </Flex>
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
