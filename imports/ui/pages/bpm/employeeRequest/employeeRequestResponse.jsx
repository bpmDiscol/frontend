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
import SpinningLoader from "../../../components/spinningLoader";
import { getCase, getTask, getTaskName } from "../../../config/taskManagement";

export default function EmployeeRequestResponse({
  tabTitles,
  tabContents,
  request,
}) {
  const { Text, Title } = Typography;
  const { setView, userName } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
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
    return <Component requestEmployee={requestEmployeeData} />;
  }

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "send") return callToAction();
  }

  async function callToAction() {
    setWaitingToSend(true)
    const response = await request({userName});
    setWaitingToSend(false)
    if (response == "no token") {
      openNotification(
        "Error",
        "Algo ha salido mal",
        "Un error del servidor obliga a que ingreses nuevamente"
      );
      safeLogOut();
      return;
    }
    if (!response?.error) {
      Meteor.call("delete_task", getTaskName() + getTask(), (err) => {
        if (!err) sessionStorage.removeItem("albous");
      });
      openNotification(
        "success",
        "¡Buen trabajo!",
        "Los archivos se han enviado satisfactoriamente"
      );
      setTimeout(() => {
        setView("tasks");
      }, 1000);
    }
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
