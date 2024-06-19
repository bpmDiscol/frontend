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
import PositionCurricullums from "./positionCurricullums";
import { NotificationsContext } from "../../../context/notificationsProvider";
import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../../api/requestEmployeData/requestEmployeeDataPublication";

export default function EmployeeRequestCurricullums({ caseId }) {
  const { Text, Title } = Typography;
  const { setView } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [waitToSend, setWaitingToSend] = React.useState(false);
  const { openNotification } = React.useContext(NotificationsContext);

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
    setTabView(<LoadPage Component={tabContents[tabContents.length - 1]} />);
  }, []);

  function LoadPage({ Component }) {
    return <Component requestEmployee={requestEmployeeData} />;
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
    if (buttonResponse == "send") return request();
  }

  function request() {
    setWaitingToSend(true);
    Meteor.call("send_curricullums", caseId, (error, response) => {
      setWaitingToSend(false);
      if (error) {
        console.log(error);
        return;
      }
      if (response == "no token") {
        openNotification(
          "Error",
          "Algo ha salido mal",
          "Un error del servidor obliga a que ingreses nuevamente"
        );
        safeLogOut();
      } else {
        if (!response?.error) {
          openNotification(
            "success",
            "¡Buen trabajo!",
            "Los archivos se han enviado satisfactoriamente"
          );
          setView("tasks");
        }
      }
    });
  }

  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Requisición de personal<Text strong>(Cargar curricullums)</Text>
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
          {requestEmployeeData && tabView}
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
          title="¿Enviar los Curricullums?"
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
