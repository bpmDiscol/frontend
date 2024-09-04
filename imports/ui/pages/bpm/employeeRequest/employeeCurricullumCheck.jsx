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
import PositionCurricullumCheck from "./positioncurricullumCheck";

const allFields = [
  "tecnicalknowledge",
  "learningAdaptation",
  "tecnicalEvaluation",
];

export default function EmployeeCurricullumCheck() {
  const { Text, Title } = Typography;
  const { setView, userName } = React.useContext(MainViewContext);
  const { openNotification } = React.useContext(NotificationsContext);
  const [tabView, setTabView] = React.useState();

  const [waitToSend, setWaitingToSend] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [curricullums, setCurricullums] = React.useState([]);
  const [checkeds, setCheckeds] = React.useState([]);
  const [taskChecked, setTaskChecked] = React.useState(false);
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

  async function fillTask() {
    const taskId = getTaskName() + getTask();
    const existTask = await Meteor.callAsync(
      "exist_task",
      taskId,
      Meteor.userId()
    );
    if (!existTask) {
      const value = { taskId };
      requestEmployeeData?.interviewInput?.forEach((iv) => {
        value[iv.interviewId] = iv;
      });
      await Meteor.callAsync("add_task", value, Meteor.userId());
    }
    setTaskChecked(true);
  }

  function reloadPage(index) {
    setTabView(
      <LoadPage
        Component={tabContents[index]}
        curricullums={curricullums}
        interviews={requestEmployeeData?.interviewInput}
        checkeds={checkeds}
        setCheckeds={setCheckeds}
      />
    );
  }
  React.useEffect(() => {
    if (!reload && requestEmployeeData) {
      fillTask();
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
  }) {
    return (
      <Component
        requestEmployee={requestEmployeeData}
        curricullums={curricullums}
        interviews={interviews}
        checkeds={checkeds}
        setCheckeds={setCheckeds}
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
    //PositionCVFiles
    PositionCurricullumCheck,
  ];

  async function handleButtonResponses(buttonResponse) {
    if (buttonResponse == "return") setView("tasks");
    if (buttonResponse == "send") request(await getApproveds());
  }

  function isCompleted(id, backgrounds) {
    if (Object.keys(backgrounds).includes(id))
      return allFields.every((field) => {
        if (Object.keys(backgrounds[id]).includes(field))
          return backgrounds[id][field];
        return false;
      });
  }

  async function getApproveds() {
    const selectedInterviews = requestEmployeeData?.interviewInput.filter(
      (interview) => interview.selected
    ).length;

    const taskId = getTaskName() + getTask();
    const resp = await Meteor.callAsync(
      "get_task_data",
      taskId,
      Meteor.userId()
    );
    if (resp) {
      const backgrounds = {};
      Object.keys(resp[0]).map((respKey) => {
        if (resp[0][respKey].selected) backgrounds[respKey] = resp[0][respKey];
      });

      const nonTouched = Object.keys(backgrounds).filter((bgKey) => {
        if (!Object.keys(backgrounds[bgKey]).includes("approved")) {
          const candidate = requestEmployeeData.curricullumsInput.filter(
            (data) => data.fileId == bgKey
          );
          if (!candidate.length) return false;
          openNotification(
            "warning",
            "¡ups... has olvidado algo!!",
            `Aun no has evaluado a ${candidate[0].applicantName} ${candidate[0].applicantMidname}`
          );
          return true;
        }
        return false;
      });
      if (nonTouched.length) return;

      const completeds = curricullums.filter((curricullum) =>
        isCompleted(curricullum.fileId, backgrounds)
      ).length;
      if (completeds < selectedInterviews) {
        openNotification(
          "warning",
          "¡Estamos cerca!!",
          "Recuerda que debes llenar todos los conceptos sobre los candidatos."
        );
        return;
      }
      const approveds = Object.keys(backgrounds).filter(
        (id) => backgrounds[id].approved
      );
      return { approveds, backgrounds };
    }
  }

  async function setConcepts(candidates) {
    Object.keys(candidates).forEach(async (candidate) => {
      await Meteor.callAsync(
        "add_leader_concepts",
        candidates[candidate].tecnicalknowledge,
        candidates[candidate].learningAdaptation,
        candidates[candidate].tecnicalEvaluation,
        getCase(),
        candidate
      ).catch((e) => console.log(e));
    });
  }

  async function request(res) {
    if (!res) return;
    const { approveds, backgrounds } = res;
    setWaitingToSend(true);
    const taskId = getTaskName() + getTask();
    await setConcepts(backgrounds);
    Meteor.call(
      "check_profiles",
      approveds,
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
            Meteor.call("delete_task", taskId, Meteor.userId());
            openNotification(
              "success",
              "¡Buen trabajo!",
              "Los archivos se han enviado satisfactoriamente"
            );
            setTimeout(() => {
              setView("tasks");
              setWaitingToSend(false);
            }, 1000);
          }
        }
      }
    );
  }

  return (
    <Flex id="employee-request-container" vertical gap={"10px"}>
      <Flex vertical wrap>
        <Title level={1}>
          Requisición de personal
          <Text strong>(Selección de candidatos)</Text>
        </Title>
      </Flex>

      <Flex vertical justify="flex-start" gap={"10px"} id="segmented-tabs">
        <Flex style={{ overflow: "auto" }} id="segmented">
          <Segmented
            options={tabTitles}
            defaultValue={tabContents.length - 1}
            onChange={(value) => reloadPage(value)}
            disabled={!requestEmployeeData}
          />
        </Flex>
        <SpinningLoader
          condition={requestEmployeeData && taskChecked}
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
    </Flex>
  );
}
