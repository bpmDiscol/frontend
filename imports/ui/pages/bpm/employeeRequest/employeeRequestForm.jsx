import React from "react";
import { Button, Flex, Segmented, Typography } from "antd";
import { RotateLeftOutlined, SendOutlined } from "@ant-design/icons";

import { MainViewContext } from "../../../context/mainViewProvider";

import RequestGeneralities from "./requestGeneralities";
import RequestVehicle from "./requestVehicle";
import RequestRequirements from "./requestRequirements";
import RequestGears from "./requestGears";
import RequestObservations from "./requestObservations";

import { enqueueSnackbar } from "notistack";

const { Text, Title } = Typography;

export default function EmployeeRequestForm() {
  const { setView } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [requestData, setRequestData] = React.useState();
  const [processId, setProcessId] = React.useState();

  React.useEffect(() => {
    request(setRequestData);
    Meteor.call("get_processes", (error, response) => {
      if (!error) {
        const myProcess = response.filter(
          (process) => process.displayName == "employee_request"
        );

        setProcessId(myProcess[0]?.id);
      }
    });
  }, []);

  React.useEffect(() => {
    if (requestData) setTabView(LoadPage(tabContents[0]));
  }, [requestData]);
  //re render dependiendo de request data

  function updateData(field, value) {
    const taskId = "employeeRequestForm";
    console.log({ taskId, field, value });
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
    RequestObservations,
  ];

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("process");
    if (buttonResponse == "send") request(startRequest);
  }

  function request(callback) {
    Meteor.call("get_task_data", "employeeRequestForm", (error, response) => {
      if (!error) {
        callback(response);
      }
    });
  }

  function startRequest(request) {
    Meteor.call(
      "start_employee_request",
      { request, processId },
      (error, response) => {
        if (error)
          enqueueSnackbar(
            `Error al enviar petición. \nRevisa que los campos esten llenados correctamente`,
            {
              variant: "error",
              autoHideDuration: 2000,
            }
          );
        else {
          Meteor.call("delete_task", "employeeRequestForm");
          setView("process");
          enqueueSnackbar("Petición creada correctamente", {
            variant: "success",
            autoHideDuration: 2000,
          });
        }
      }
    );
  }

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
          onClick={() => handleButtonResponses("send")}
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
