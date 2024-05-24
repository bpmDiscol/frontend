import React from "react";
import PositionGereralities from "./positionGereralities";
import PositionVehicle from "./positionVehicle";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";
import PositionConcept from "./positionConcept";
import { enqueueSnackbar } from "notistack";

import { MainViewContext } from "../../../context/mainViewProvider";

import { Button, Empty, Flex, Segmented, Typography } from "antd";
import {
  RotateLeftOutlined,
  DislikeFilled,
  LikeFilled,
  SendOutlined,
} from "@ant-design/icons";
import { safeLogOut } from "../../../misc/userStatus";
import RequestGeneralities from "./requestGeneralities";
import RequestVehicle from "./requestVehicle";

export default function EmployeeRequestForm() {
  const { setView } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [concept, setConcept] = React.useState("");

  React.useEffect(() => {
    setTabView(<RequestGeneralities />);
  }, []);
  

  const tabTitles = [
    { label: "Datos del cargo", value: 0 },
    { label: "Vehiculo", value: 1 },
    { label: "Requerimientos", value: 2 },
    { label: "Equipo necesario", value: 3 },
    { label: "Observaciones", value: 4 },
    { label: "Mi concepto", value: 5 },
  ];
  const tabContents = [<RequestGeneralities />, <RequestVehicle />];

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
          Solicitud de empleado<Text strong>(Petición de lider)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Segmented
          options={tabTitles}
          onChange={(value) => setTabView(tabContents[value])}
          defaultValue={0}
        />
        <Flex
          vertical
          style={{ height: "50lvh", overflowY: "auto", overflowX: "hidden" }}
        >
          {tabView}
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
          onClick={() => handleButtonResponses("approve")}
          icon={<SendOutlined />}
          iconPosition="end"
          id="approve-button"
        >
          Enviar
        </Button>
      </Flex>
    </Flex>
  );
}
