import React from "react";
import { Button, Flex, Popconfirm, Segmented, Typography } from "antd";
import {
  BackwardOutlined,
  ForwardOutlined,
  RotateLeftOutlined,
  SendOutlined,
} from "@ant-design/icons";

import { MainViewContext } from "../../../context/mainViewProvider";

import RequestGeneralities from "./requestGeneralities";
import RequestVehicle from "./requestVehicle";
import RequestRequirements from "./requestRequirements";
import RequestGears from "./requestGears";
import RequestObservations from "./requestObservations";
import { NotificationsContext } from "../../../context/notificationsProvider";
import { safeLogOut } from "../../../misc/userStatus";
import SpinningLoader from "../../../components/spinningLoader";

const { Text, Title } = Typography;

export default function EmployeeRequestForm() {
  const { setView } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [requestData, setRequestData] = React.useState();
  const [processId, setProcessId] = React.useState();
  const [currentTab, setCurrentTab] = React.useState(0);
  const [errorFields, setErrorFields] = React.useState([]);
  const { openNotification } = React.useContext(NotificationsContext);
  const [waitToSend, setWaitingToSend] = React.useState(false);

  React.useEffect(() => {
    request(setRequestData);
    Meteor.call("get_processes", Meteor.userId(), (error, response) => {
      if (!error && response != "error") {
        const myProcess = response?.filter(
          (process) => process.displayName == "employee_request"
        );

        setProcessId(myProcess[0]?.id);
      }
    });
  }, []);

  async function updateData(field, value) {
    const taskId = "employeeRequestForm";
    await Meteor.callAsync("update_task", {
      taskId,
      field,
      value,
      user: Meteor.userId(),
    }).catch((error) => console.error(error));
  }

  function fiterErrors(fieldId) {
    const fields = errorFields?.filter((field) =>
      field.path?.includes(fieldId)
    );
    return fields?.length == 0 ? "" : "error";
  }

  function reloadPage(index) {
    setTabView(
      <LoadPage
        Component={tabContents[index]}
        requestData={requestData}
        updateData={updateData}
        fiterErrors={fiterErrors}
      />
    );
  }

  function LoadPage({ Component, requestData, updateData, fiterErrors }) {
    return (
      <Component
        requestData={requestData}
        update={updateData}
        fiterErrors={fiterErrors}
      />
    );
  }
  let loaded = false;

  React.useEffect(() => {
    if (!loaded && requestData) {
      loaded = true;
      reloadPage(currentTab);
    }
  }, [requestData]);

  const tabTitles = [
    { label: "Datos del cargo", value: 0 },
    { label: "Vehiculo", value: 1 },
    { label: "Requerimientos", value: 2 },
    { label: "Herramientas", value: 3 },
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
    Meteor.call(
      "get_task_data",
      "employeeRequestForm",
      Meteor.userId(),
      (error, response) => {
        if (!error) {
          callback(response ? response[0] : []);
        }
      }
    );
  }

  function startRequest(request) {
    setWaitingToSend(true);
    Meteor.call(
      "start_employee_request",
      { request, processId, user: Meteor.userId() },
      (error, response) => {
        setWaitingToSend(false);
        if (response?.error) {
          if (response?.status >= 500) {
            openNotification(
              "error",
              "Esto no esta bien 🤔",
              "Algo funciona mal con el servidor. Contacta personal de sistemas, por favor"
            );
            return;
          }

          if (response?.status >= 400) {
            safeLogOut();
            openNotification(
              "error",
              "Ha ocurrido un error 😓",
              "Comprueba tus credenciales e intentalo nuevamente"
            );
            return;
          }
          setErrorFields(response.issues);
          openNotification(
            "warning",
            "Date un momento para revisar",
            "Algunos campos necesitan llenarse. Revisa los formularios e intenta nuevamente"
          );
        } else {
          Meteor.call("delete_task", "employeeRequestForm", Meteor.userId());
          setTimeout(() => {
            setView("process");
          }, 1000);
          openNotification(
            "success",
            "¡Buen trabajo!",
            "La requisición de personal se ha creado correctamente"
          );
        }
      }
    );
  }

  function handleButtonNext() {
    const maxTab = tabContents.length;
    const nextTab = currentTab + 1;
    if (nextTab == maxTab) handleButtonResponses("send");
    if (nextTab < maxTab) changeTab(nextTab);
  }

  function changeTab(tabNumber) {
    request(setRequestData);
    reloadPage(tabNumber);
    setCurrentTab(tabNumber);
  }

  return (
    <Flex
      id="employee-request-container"
      vertical
      gap={"10px"}
      style={{ width: "90%" }}
    >
      <Flex vertical wrap>
        <Title level={1}>
          Requisición de personal<Text strong>(Petición de lider)</Text>
        </Title>
      </Flex>

      <Flex vertical gap={"10px"} id="segmented-tabs">
        <Segmented
          options={tabTitles}
          defaultValue={0}
          value={currentTab}
          onChange={(value) => changeTab(value)}
          disabled={!requestEmployeeData}
        />

        <SpinningLoader condition={requestData} content={tabView} />
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
          onClick={() => changeTab(currentTab - 1)}
          icon={<BackwardOutlined />}
          iconPosition="start"
          id="approve-button"
          disabled={currentTab == 0}
        >
          Anterior
        </Button>
        <Popconfirm
          title="Rechazas la solicitud?"
          description="¿Estás de acuerdo con esta solicitud? Recuerda dejar un concepto "
          onConfirm={handleButtonNext}
          okText="¡Por supuesto, adelante!"
          cancelText="Déjame pensarlo"
          disabled={currentTab !== tabContents.length - 1}
        >
          <Button
            type="primary"
            loading={waitToSend}
            onClick={
              currentTab == tabContents.length - 1 ? null : handleButtonNext
            }
            icon={
              currentTab == tabContents.length - 1 ? (
                <SendOutlined />
              ) : (
                <ForwardOutlined />
              )
            }
            iconPosition="end"
            id="approve-button"
            danger={currentTab == tabContents.length - 1}
          >
            {currentTab == tabContents.length - 1 ? "Enviar" : "Siguiente"}
          </Button>
        </Popconfirm>
      </Flex>
    </Flex>
  );
}
