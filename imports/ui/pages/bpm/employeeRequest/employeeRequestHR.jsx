import React from "react";
import PositionGereralities from "./positionGereralities";
import PositionVehicle from "./positionVehicle";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";
import PositionConcept from "./positionConcept";
import { MainViewContext } from "../../../context/mainViewProvider";

import { useTracker } from "meteor/react-meteor-data";

import { Button, Flex, Popconfirm, Segmented, Typography } from "antd";
import {
  RotateLeftOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import { safeLogOut } from "../../../misc/userStatus";
import { NotificationsContext } from "../../../context/notificationsProvider";
import { requestEmployeeCollection } from "../../../../api/requestEmployeData/requestEmployeeDataPublication";
import SpinningLoader from "../../../components/spinningLoader";
import { getCase, getTask } from "../../../config/taskManagement";
import RequestANS from "./requestANS";

export default function EmployeeRequestHR() {
  const { Text, Title } = Typography;
  const { setView, userName } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [concept, setConcept] = React.useState("");
  const [ANS, setANS] = React.useState();
  const [waitToSend, setWaitingToSend] = React.useState(false);
  const { openNotification } = React.useContext(NotificationsContext);

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

  React.useEffect(() => {
    setTabView(<LoadPage Component={tabContents[tabContents.length - 1]} />);
  }, []);

  function LoadPage({ Component }) {
    return (
      <Component
        requestEmployee={requestEmployeeData}
        concept={concept}
        setConcept={setConcept}
        ANS={ANS}
        setANS={setANS}
      />
    );
  }
  const tabTitles = [
    { label: "Datos del cargo", value: 0 },
    { label: "Vehiculo", value: 1 },
    { label: "Requerimientos", value: 2 },
    { label: "Equipo necesario", value: 3 },
    { label: "Observaciones", value: 4 },
    { label: "Mi concepto", value: 5 },
    { label: "ANS", value: 6 },
  ];
  const tabContents = [
    PositionGereralities,
    PositionVehicle,
    PositionRequirements,
    PositionGears,
    PositionObservations,
    PositionConcept,
    RequestANS,
  ];

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "reject") return request("reject");
    if (buttonResponse == "approve") return request("approved");
  }

  function request(response) {
    if (!ANS) {
      openNotification(
        "warning",
        "Date un respiro...",
        "Aun no has configurado los ANS para este proceso"
      );
      return;
    }
    setWaitingToSend(true);
    Meteor.call(
      "send_employee_request",
      {
        userName,
        response,
        concept,
        ANS,
        caseId: getCase(),
        taskId: getTask(),
        user: Meteor.userId(),
        humanResources: true,
      },
      (error, response) => {
        setWaitingToSend(false);
        if (response == "no token") safeLogOut();
        else {
          if (!response.error) {
            openNotification(
              response?.error ? "error" : "success",
              response?.error ? "Ha ocurrido un error" : "¡Buenas noticias!",
              response?.message
            );
            setTimeout(() => {
              setView("tasks");
            }, 2000);
          }
        }
      }
    );
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
          Requisición de personal<Text strong>(Concepto Recursos Humanos)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Segmented
          options={tabTitles}
          onChange={(value) => {
            setTabView(<LoadPage Component={tabContents[value]} />);
          }}
          defaultValue={tabContents.length - 1}
          disabled={!requestEmployeeData}
        />
        <SpinningLoader
          condition={requestEmployeeData}
          content={tabView}
        />
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
          title="¿Rechazas la solicitud?"
          description="Confirmas que no estas de acuerdo con esta solicitud. Recuerda dejar tu concepto "
          onConfirm={() => handleButtonResponses("reject")}
          okText="Descártala"
          cancelText="Déjame pensarlo"
        >
          <Button
            type="primary"
            danger
            icon={<DislikeFilled />}
            id="reject-button"
          >
            Rechazar
          </Button>
        </Popconfirm>
        <Popconfirm
          title="¿Apruebas la solicitud?"
          description="Confirmas que estas de acuerdo con esta requisición de personal. Recuerda dejar tu concepto"
          onConfirm={() => handleButtonResponses("approve")}
          okText="Por supuesto"
          cancelText="Déjame pensarlo"
        >
          <Button
            loading={waitToSend}
            type="primary"
            style={{ background: "green" }}
            icon={<LikeFilled />}
            iconPosition="end"
            id="approve-button"
          >
            Aceptar
          </Button>
        </Popconfirm>
      </Flex>
    </Flex>
  );
}
