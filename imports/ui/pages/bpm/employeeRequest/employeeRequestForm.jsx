import React from "react";
import { Button, Flex, Segmented, Typography } from "antd";
import { RotateLeftOutlined, SendOutlined } from "@ant-design/icons";

import { MainViewContext } from "../../../context/mainViewProvider";

import RequestGeneralities from "./requestGeneralities";
import RequestVehicle from "./requestVehicle";
import RequestRequirements from "./requestRequirements";
import RequestGears from "./requestGears";
import RequestObservations from "./requestObservations";

export default function EmployeeRequestForm() {
  const { setView } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [requestData, setRequestData] = React.useState();

  React.useEffect(() => {
    Meteor.call("get_task_data", "employeeRequestForm", (error, response) => {
      if (!error) {
        setRequestData(response);
      }
    });
  }, []);

  React.useEffect(() => {
    if (requestData) setTabView(LoadPage(tabContents[0]));
  }, [requestData]);
  //re render dependiendo de request data

  function updateData(field, value) {
    const taskId = "employeeRequestForm";
    Meteor.call("update_task", { taskId, field, value });
  }

  const LoadPage = React.useCallback(
    (Component) => {
      return <Component requestData={requestData} update={updateData} />;
    },
    [requestData]
  );

  const tabTitles = [
    { label: "Datos del cargo", value: 0 },
    { label: "Vehiculo", value: 1 },
    { label: "Requerimientos", value: 2 },
    { label: "Equipo necesario", value: 3 },
    { label: "Observaciones", value: 4 },
  ];
  const tabContents = [
    RequestGeneralities,
    RequestVehicle,
    RequestRequirements,
    RequestGears,
    RequestObservations
  ];

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "reject") return request("reject");
    if (buttonResponse == "approve") return request("approved");
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
          onChange={(value) => setTabView(LoadPage(tabContents[value]))}
          defaultValue={0}
        />
        <Flex
          vertical
          style={{ height: "55lvh", overflowY: "auto", overflowX: "hidden" }}
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
