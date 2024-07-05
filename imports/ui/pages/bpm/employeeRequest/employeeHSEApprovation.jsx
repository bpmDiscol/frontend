import React from "react";
import PositionGereralities from "./positionGereralities";
import PositionVehicle from "./positionVehicle";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";

import { MainViewContext } from "../../../context/mainViewProvider";

import {
  Button,
  Flex,
  Modal,
  Popconfirm,
  Result,
  Segmented,
  Typography,
} from "antd";
import { RotateLeftOutlined, SendOutlined } from "@ant-design/icons";
import { safeLogOut } from "../../../misc/userStatus";
import { NotificationsContext } from "../../../context/notificationsProvider";
import SpinningLoader from "../../../components/spinningLoader";

import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../../api/requestEmployeData/requestEmployeeDataPublication";
import { getCase, getTask, getTaskName } from "../../../config/taskManagement";
import PositionHSEApprovation from "./positionHSEApprovation";

export default function EmployeeHSEApprovation() {
  const { Text, Title } = Typography;
  const { setView, userName } = React.useContext(MainViewContext);
  const { openNotification } = React.useContext(NotificationsContext);
  const [tabView, setTabView] = React.useState();
  const [warningMessage, setWarningMessage] = React.useState(false);

  const [waitToSend, setWaitingToSend] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [curricullums, setCurricullums] = React.useState([]);
  const [checkeds, setCheckeds] = React.useState([]);
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
    setTabView(
      <LoadPage
        Component={tabContents[index]}
        curricullums={curricullums}
        interviews={requestEmployeeData?.interviewInput}
        healthResponse={requestEmployeeData?.healthResponseInput}
        checkeds={checkeds}
        setCheckeds={setCheckeds}
      />
    );
  }
  React.useEffect(() => {
    if (!reload && requestEmployeeData) {
      setReload(true);
      const curricullums = requestEmployeeData?.curricullumsInput?.map(
        async (curricullum) => {
          try {
            return await Meteor.callAsync("getFileLink", {
              id: curricullum.fileId,
              collectionName: "curricullums",
            });
          } catch (error) {
            return console.error(error);
          }
        }
      );

      Promise.all(curricullums)
        .then((values) =>
          values.map((value, index) => {
            const curricullum = requestEmployeeData?.curricullumsInput[index];
            return { ...curricullum, link: value[0].link };
          })
        )
        .then((curricullums) => {
          //Guardar data de entrevistas
          setCurricullums(curricullums);
          //establecer primera vista
          document.getElementById("segmented").scrollTo(1000, 0);
        });
    }
  }, [requestEmployeeData]);

  React.useEffect(() => {
    if (curricullums) {
      reloadPage(tabContents.length - 1);
    }
  }, [curricullums, checkeds]);

  function LoadPage({
    Component,
    curricullums,
    interviews,
    checkeds,
    setCheckeds,
    healthResponse,
  }) {
    return (
      <Component
        requestEmployee={requestEmployeeData}
        curricullums={curricullums}
        interviews={interviews}
        checkeds={checkeds}
        setCheckeds={setCheckeds}
        healthResponse={healthResponse}
      />
    );
  }

  const tabTitles = [
    { label: "Datos del cargo", value: 0 },
    { label: "Vehiculo", value: 1 },
    { label: "Requerimientos", value: 2 },
    { label: "Equipo necesario", value: 3 },
    { label: "Observaciones", value: 4 },
    { label: "Candidatos", value: 5 },
  ];

  const tabContents = [
    PositionGereralities,
    PositionVehicle,
    PositionRequirements,
    PositionGears,
    PositionObservations,
    PositionHSEApprovation,
  ];

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "send") setWarningMessage(true);
  }

  function request() {
    setWaitingToSend(true);
    const taskId = getTaskName() + getTask();
    Meteor.call(
      "check_profiles",
      checkeds,
      getCase(),
      getTask(),
      userName,
      (err, res) => {
        if (err) console.log(err);
        if (res == "no token") {
          openNotification(
            "Error",
            "Algo ha salido mal",
            "Hubo error del servidor, por favor ingresa nuevamente"
          );
          safeLogOut();
        } else {
          if (!res.error) {
            Meteor.call("delete_task", taskId);
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
        setWaitingToSend(false);
      }
    );
  }

  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Requisición de personal
          <Text strong>(Revisión de exámenes médicos)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Flex style={{ overflow: "auto" }} id="segmented">
          <Segmented
            options={tabTitles}
            defaultValue={tabContents.length - 1}
            onChange={(value) => reloadPage(value)}
          />
        </Flex>
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
          title="¿Has verificado que estén seleccionados los candidatos?"
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
      <Modal
        title="Verifiquemos antes de enviar..."
        closable={true}
        onCancel={() => setWarningMessage(false)}
        open={warningMessage}
        onOk={() => setWarningMessage(false)}
        footer={[
          <Button onClick={() => request()} key="send">
            Es correcto
          </Button>,
          <Button
            type="primary"
            style={{ marginTop: "1rem" }}
            onClick={() => setWarningMessage(false)}
            key="wait"
          >
            Debo revisar
          </Button>,
        ]}
      >
        <Result
          status={checkeds.length == 0 ? "warning" : "info"}
          title={"Número de seleccionados: " + checkeds.length}
        />
      </Modal>
    </Flex>
  );
}
