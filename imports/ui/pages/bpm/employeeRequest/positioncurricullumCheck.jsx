import React from "react";
import { Button, Drawer, Flex, Table, Typography } from "antd";
import {
  DownloadOutlined,
  EyeOutlined,
  FileTextFilled,
} from "@ant-design/icons";

import { NotificationsContext } from "../../../context/notificationsProvider.jsx";
import { getTask, getTaskName } from "../../../config/taskManagement.js";
import LeaderInterview from "../../../components/interviewForm.jsx/leaderInterview.jsx";
import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";

const { Text } = Typography;
const googleDocsViewer = "http://docs.google.com/viewer?url=";

const closed = { applicant: null, open: false, view: null };
const allFields = [
  "tecnicalknowledge",
  "learningAdaptation",
  "tecnicalEvaluation",
];

export default function PositionCurricullumCheck({
  curricullums,
  interviews,
  requestEmployee,
}) {
  const [drawerData, setDrawerData] = React.useState(closed);
  const [background, setBackground] = React.useState();
  const [taskId, setTaskId] = React.useState();
  const { openNotification } = React.useContext(NotificationsContext);

  function newTab(url) {
    let newTab = document.createElement("a");
    newTab.href = url;
    newTab.target = "_blank";
    newTab.click();
  }

  function handleClose() {
    setDrawerData(closed);
  }

  React.useEffect(() => {
    const taskId = getTaskName() + getTask();
    setTaskId(taskId);
    Meteor.call("get_task_data", taskId, Meteor.userId(), (err, resp) => {
      if (!err && resp) setBackground(resp[0]);
    });
  }, [drawerData]);

  async function updateData(field, value) {
    await Meteor.callAsync("update_task", {
      taskId,
      field,
      value,
      user: Meteor.userId(),
    }).catch((e) => console.log(e));
  }

  function countApproveds() {
    const [taskId, ...candidates] = Object.keys(background);
    return candidates.filter((id) => background[id].approved).length;
  }

  function toggleApproved(id) {
    if (countApproveds > requestEmployee.vacancies) {
      openNotification(
        "info",
        "Para su información",
        "Recuerda que el numero maximo de vacantes es de " +
          requestEmployee.vacancies
      );
      return;
    }

    const currentCandidate = { ...background[id] };
    const currentState = currentCandidate?.approved;
    const updatedCandidate = { ...currentCandidate, approved: !currentState };
    setBackground({ ...background, [id]: updatedCandidate });
    updateData(`${id}.approved`, !currentState);
  }

  function isApproved(id) {
    const isPresent = Object.keys(background).includes(id);
    if (!isPresent) return;
    return background[id].approved;
  }

  function isCompleted(id) {
    if (Object.keys(background).includes(id))
      return allFields.every((field) => {
        if (Object.keys(background[id]).includes(field))
          return background[id][field];
        return false;
      });
  }

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Flex gap={16} vertical style={{ width: "100%" }}>
        <Table
          dataSource={curricullums?.filter((_, i) => interviews[i].selected)}
          pagination={false}
          rowKey={(record) => record.fileId}
        >
          <Table.Column
            title="Candidatos"
            render={(_, record) => (
              <Text>
                {`${record.applicantName} ${record.applicantMidname} ${record.applicantLastname}`.toUpperCase()}
              </Text>
            )}
            width={"25rem"}
          />
          <Table.Column
            title="Estados"
            render={(interview) =>
              background && (
                <Button
                  onClick={() => toggleApproved(interview.fileId)}
                  style={{
                    width: "10rem",
                    backgroundColor:
                      isApproved(interview.fileId) == undefined
                        ? "lightgray"
                        : isApproved(interview.fileId)
                        ? "lightgreen"
                        : "lightpink",
                  }}
                >
                  {isApproved(interview.fileId) == undefined
                    ? "No evaluado"
                    : isApproved(interview.fileId)
                    ? "Aprobado"
                    : "No aprobado"}
                </Button>
              )
            }
          />
          <Table.Column
            title="Conceptos"
            render={(interview) =>
              background && (
                <Button
                  style={{
                    background: isCompleted(interview.fileId)
                      ? "lightgreen"
                      : "#fff072",
                  }}
                  onClick={() => {
                    setDrawerData({
                      applicant: interview,
                      open: true,
                      view: (
                        <LeaderInterview
                          fileId={interview.fileId}
                          updateData={updateData}
                          background={background[interview.fileId]}
                        />
                      ),
                    });
                  }}
                >
                  Dar concepto
                </Button>
              )
            }
          />
          <Table.Column
            title="Entrevistas"
            render={(interview, _, index) => (
              <Button
                onClick={() => {
                  setDrawerData({
                    applicant: interview,
                    open: true,
                    view: (
                      <InterviewView
                        fileId={interview.fileId}
                        onClose={handleClose}
                        interviewForm={interviews[index]}
                      />
                    ),
                  });
                }}
                icon={<FileTextFilled />}
                type="link"
              >
                Ver
              </Button>
            )}
          />
          <Table.Column
            title="Curricullums"
            render={(interview) => (
              <Flex>
                <Button
                  onClick={() => newTab(googleDocsViewer + interview.link)}
                  icon={<EyeOutlined />}
                  type="link"
                >
                  Ver
                </Button>
                <Button
                  onClick={() => newTab(interview.link, true)}
                  icon={<DownloadOutlined />}
                  type="link"
                >
                  Descargar
                </Button>
              </Flex>
            )}
          />
        </Table>
      </Flex>

      <Drawer
        title={`${drawerData.applicant?.applicantName} ${drawerData.applicant?.applicantMidname} ${drawerData.applicant?.applicantLastname}`.toUpperCase()}
        width={"70lvw"}
        open={drawerData.open}
        onClose={() => handleClose()}
        styles={{
          body: {
            paddingTop: "1lvh",
          },
        }}
      >
        {drawerData.view}
      </Drawer>
    </Flex>
  );
}
