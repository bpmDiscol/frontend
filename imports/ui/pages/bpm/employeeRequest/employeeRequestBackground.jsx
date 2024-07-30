import React from "react";
import PositionGereralities from "./positionGereralities";
import PositionVehicle from "./positionVehicle";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";

import { MainViewContext } from "../../../context/mainViewProvider";

import {
  Button,
  Empty,
  Flex,
  Modal,
  Popconfirm,
  Result,
  Segmented,
  Spin,
  Typography,
} from "antd";
import { RotateLeftOutlined, SendOutlined } from "@ant-design/icons";
import { safeLogOut } from "../../../misc/userStatus";
import { NotificationsContext } from "../../../context/notificationsProvider";
import PositionBackgroud from "./positionBackground";
import SpinningLoader from "../../../components/spinningLoader";

import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../../api/requestEmployeData/requestEmployeeDataPublication";
import { getCase, getTask, getTaskName } from "../../../config/taskManagement";
import { sonIguales } from "../../../misc/sonIguales";

export default function EmployeeRequestBackground() {
  const { Text, Title } = Typography;
  const { setView, userName } = React.useContext(MainViewContext);
  const { openNotification } = React.useContext(NotificationsContext);
  const [tabView, setTabView] = React.useState();

  const [waitToSend, setWaitingToSend] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [curricullums, setCurricullums] = React.useState([]);
  const [warningUsers, setWarningUsers] = React.useState([]);
  const [warningMessage, setWarningMessage] = React.useState(false);

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
        warningUsers={warningUsers}
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
  }, [curricullums, warningUsers]);

  function LoadPage({ Component, curricullums, interviews, warningUsers }) {
    return (
      <Component
        requestEmployee={requestEmployeeData}
        curricullums={curricullums}
        interviews={interviews}
        warningUsers={warningUsers}
      />
    );
  }

  const tabTitles = [
    { label: "Datos del cargo", value: 0 },
    { label: "Vehiculo", value: 1 },
    { label: "Requerimientos", value: 2 },
    { label: "Equipo necesario", value: 3 },
    { label: "Observaciones", value: 4 },
    { label: "Antecedentes", value: 5 },
  ];
  const tabContents = [
    PositionGereralities,
    PositionVehicle,
    PositionRequirements,
    PositionGears,
    PositionObservations,
    PositionBackgroud,
  ];

  function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "send") return request();
  }

  function request() {
    setWaitingToSend(true);
    const taskId = getTaskName() + getTask();
    Meteor.call("get_task_data", taskId, Meteor.userId(), (err, resp) => {
      if (!err && resp?.length) {
        const { taskId, auxiliarId, ...bgs } = resp[0];
        const handledCandidates = Object.keys(bgs);
        const uploadeds = handledCandidates.filter((key) =>
          Object.keys(bgs[key]).includes("legal_background")
        );
        const currentCurricullums = requestEmployeeData.interviewInput.filter(
          (interview) => interview.selected
        );

        if(!auxiliarId){
          openNotification(
            "warning",
            "¡Ups... se te ha olvidado algo!",
            "No has seleccionado un auxiliar"
          );
          setWaitingToSend(false);
          return;
        }

        if (
          handledCandidates.length < currentCurricullums.length ||
          uploadeds.length < currentCurricullums.length
        ) {
          openNotification(
            "warning",
            "¡Ups... se te ha olvidado algo!",
            "Al parecer no has has cargado algunos archivos"
          );
          setWaitingToSend(false);
          return;
        }

        const rejecteds = Object.keys(bgs).filter((key) => !bgs[key].approved);

        Meteor.callAsync("send_backgrounds", getCase(), bgs).catch((err) =>
          console.log(err)
        );

        Meteor.call(
          "reject_profiles",
          rejecteds,
          auxiliarId,
          getCase(),
          getTask(),
          userName,
          Meteor.userId(),
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
                Meteor.callAsync("delete_task", taskId, Meteor.userId()).catch(
                  (err) => console.log(err)
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
            setWaitingToSend(false);
          }
        );
      }
    });
  }

  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Requisición de personal<Text strong>(Antecedentes)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Flex vertical gap={"10px"} id="segmented">
          <Segmented
            options={tabTitles}
            defaultValue={tabContents.length - 1}
            onChange={(value) => reloadPage(value)}
            disabled={!requestEmployeeData}
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
          title="¿Enviar entrevistas?"
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
        title="🟡Espera un momento..."
        closable={true}
        onCancel={() => setWarningMessage(false)}
        open={warningMessage}
        onOk={() => setWarningMessage(false)}
        footer={[
          <Button onClick={() => request()} loading={waitToSend}>
            Enviar de todas formas
          </Button>,
          <Button
            loading={waitToSend}
            type="primary"
            style={{ marginTop: "1rem" }}
            onClick={() => setWarningMessage(false)}
            key="wait"
          >
            Revisar antes de proceder
          </Button>,
        ]}
      >
        <Result
          status="warning"
          title="Algunos archivos no han sido cargados"
        />
      </Modal>
    </Flex>
  );
}
