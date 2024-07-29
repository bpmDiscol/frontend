import React from "react";
import { MainViewContext } from "../../../context/mainViewProvider";
import { Button, Flex, Popconfirm, Segmented, Typography } from "antd";
import { RotateLeftOutlined, SendOutlined } from "@ant-design/icons";
import { safeLogOut } from "../../../misc/userStatus";
import { NotificationsContext } from "../../../context/notificationsProvider";
import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../../api/requestEmployeData/requestEmployeeDataPublication";
import SpinningLoader from "../../../components/spinningLoader";
import { getCase, getTask, getTaskName } from "../../../config/taskManagement";
import { request } from "../configPages/simpleRequest";

export default function EmployeeRequestResponse({
  tabTitles,
  tabContents,
  subtitle,
  tabNumber,
  buttons,
  salary,
}) {
  const { Text, Title } = Typography;
  const { openNotification } = React.useContext(NotificationsContext);
  const { setView, userName } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [waitToSend, setWaitingToSend] = React.useState(false);
  const [reload, setReload] = React.useState(false);

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
  function reloadPage(index) {
    const key = Math.random();
    setTabView(
      <LoadPage
        newKey={key}
        Component={tabContents[index]}
        buttons={buttons}
        salary={salary}
      />
    );
  }

  function LoadPage({ Component, newKey }) {
    return (
      requestEmployeeData && (
        <Component
          key={newKey}
          requestEmployee={requestEmployeeData}
          buttons={buttons}
          salary={salary}
        />
      )
    );
  }

  React.useEffect(() => {
    if (!reload && requestEmployeeData) {
      setReload(true);
      reloadPage(tabNumber);
    }
  }, [requestEmployeeData]);

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "send") return callToAction();
  }

  async function callToAction() {
    setWaitingToSend(true);
    const response = await request({ userName });
    setWaitingToSend(false);
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
      Meteor.call(
        "delete_task",
        getTaskName() + getTask(),
        Meteor.userId(),
        (err) => {
          if (!err) sessionStorage.removeItem("albous");
        }
      );
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
          Requisición de personal<Text strong>({subtitle})</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Segmented
          options={tabTitles}
          defaultValue={tabNumber}
          onChange={(value) => reloadPage(value)}
          disabled={!requestEmployeeData}
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
          title="¿La tarea ha sido completada?"
          onConfirm={() => handleButtonResponses("send")}
          okText="Por supuesto"
          cancelText="Espera, aun no"
        >
          <Button
            loading={waitToSend}
            type="primary"
            danger
            icon={<SendOutlined />}
            iconPosition="end"
            id="approve-button"
          >
            Realizado
          </Button>
        </Popconfirm>
      </Flex>
    </Flex>
  );
}
