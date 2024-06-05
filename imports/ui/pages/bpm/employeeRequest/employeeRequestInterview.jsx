import React from "react";
import PositionGereralities from "./positionGereralities";
import PositionVehicle from "./positionVehicle";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";

import { MainViewContext } from "../../../context/mainViewProvider";

import { Button, Flex, Popconfirm, Segmented, Typography } from "antd";
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
  const [concept, setConcept] = React.useState("");

  const { openNotification } = React.useContext(NotificationsContext);

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
  }, []);

  React.useEffect(() => {
    requestEmployee && requestEmployeeData && setLoaded(true);
  }, [requestEmployee, requestEmployeeData]);

  React.useEffect(() => {
    loaded &&
      setTabView(<LoadPage Component={tabContents[tabContents.length - 1]} />);
  }, [loaded]);

  function LoadPage({ Component }) {
    return (
      <Component
        requestEmployee={requestEmployee}
        requestEmployeeData={requestEmployeeData}
        concept={concept}
        setConcept={setConcept}
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
    PositionInterviews
  ];

  function handleButtonResponses(buttonResponse) {
    // if (buttonResponse == "return") setView("tasks");
    // if (buttonResponse == "send") return request();
  }

  function request() {
    Meteor.call("get_task_id", (err, currentTask) => {
      if (!err) {
        const taskId = "employeeCurriculllums-" + currentTask;
        Meteor.call("get_task_data", taskId, (err, resp) => {
          if (!err) {
            if (resp?.curricullums.length == 0) {
              openNotification(
                "warning",
                "Esto debe ser un error...",
                "No se ha cargado ningun archivo a la lista"
              );
              return;
            }

            const documents = resp?.curricullums?.filter(
              (it) => it.fileId == ""
            );
            if (documents.length > 0) {
              openNotification(
                "warning",
                "Esto debe ser un error...",
                "Faltan archivos en la lista que haces. Revisa e intenta nuevamente"
              );
              return;
            }

            console.log({
              curricullumsInput: resp.curricullums,
            });

            Meteor.call(
              "send_curricullums",
              {
                curricullumsInput: resp.curricullums,
              },
              (error, response) => {
                if (response == "no token") {
                  openNotification(
                    "Error",
                    "Algo ha salido mal",
                    "Un error del servidor obliga a que ingreses nuevamente"
                  );
                  safeLogOut();
                } else {
                  if (!response.error) {
                    openNotification(
                      "success",
                      "¡Buen trabajo!",
                      "Los archivos se han enviado satisfactoriamente"
                    );
                    setView("tasks");
                  }
                }
              }
            );
          }
        });
      }
    });
  }

  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Solicitud de empleado<Text strong>(Entrevistas)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Segmented
          options={tabTitles}
          defaultValue={tabContents.length - 1}
          onChange={(value) =>
            setTabView(<LoadPage Component={tabContents[value]} />)
          }
        />
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
