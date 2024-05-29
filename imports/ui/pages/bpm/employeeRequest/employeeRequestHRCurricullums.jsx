import React from "react";
import PositionGereralities from "./positionGereralities";
import PositionVehicle from "./positionVehicle";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";
import PositionConcept from "./positionConcept";
import { enqueueSnackbar } from "notistack";

import { MainViewContext } from "../../../context/mainViewProvider";

import { Button, Flex, Segmented, Typography } from "antd";
import {
  RotateLeftOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import { safeLogOut } from "../../../misc/userStatus";
import PositionCurricullums from "./positionCurricullums";

export default function EmployeeRequestCurricullums() {
  const [requestEmployeeData, setRequestEmployeeData] = React.useState();
  const [requestEmployee, setRequestEmployee] = React.useState();
  const { setView } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [loaded, setLoaded] = React.useState(false);
  const [concept, setConcept] = React.useState("");

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
    loaded && setTabView(<LoadPage Component={tabContents[0]} />);
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
    { label: "Curricullums", value: 5 },
  ];
  const tabContents = [
    PositionGereralities,
    PositionVehicle,
    PositionRequirements,
    PositionGears,
    PositionObservations,
    PositionCurricullums,
  ];

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "reject") return request("reject");
    if (buttonResponse == "approve") return request("approved");
  }

  function request(response) {
    Meteor.call(
      "send_employee_request",
      {
        response,
        concept,
      },
      (error, response) => {
        if (response == "no token") safeLogOut();
        else {
          enqueueSnackbar(response.message, {
            variant: response.error ? "error" : "success",
            autoHideDuration: 1000,
          });

          if (!response.error) setView("tasks");
        }
      }
    );
  }

  const { Text, Title } = Typography;

  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Solicitud de empleado<Text strong>(Cargar curricullums)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Segmented
          options={tabTitles}
          onChange={(value) =>
            setTabView(<LoadPage Component={tabContents[value]} />)
          }
          defaultValue={0}
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
        <Button
          type="primary"
          onClick={() => handleButtonResponses("reject")}
          icon={<DislikeFilled />}
          id="reject-button"
        >
          Rechazar
        </Button>
        <Button
          type="primary"
          onClick={() => handleButtonResponses("approve")}
          icon={<LikeFilled />}
          iconPosition="end"
          id="approve-button"
        >
          Continuar
        </Button>
      </Flex>
    </Flex>
  );
}
