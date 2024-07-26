import React from "react";
import { Button, Drawer, Flex } from "antd";
import Icon, {
  FileTextFilled,
  UserOutlined,
  WechatFilled,
} from "@ant-design/icons";

import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";
import { NotificationsContext } from "../../../context/notificationsProvider.jsx";
import { getTask, getTaskName } from "../../../config/taskManagement.js";
import LeaderInterview from "../../../components/interviewForm.jsx/leaderInterview.jsx";

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
      return allFields.every((field) =>
        Object.keys(background[id]).includes(field)
      );
  }

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Flex gap={16} vertical style={{ width: "clamp(290px, 60lvw, 60dvw)" }}>
        {curricullums
          ?.map((interview, index) => {
            return (
              <Flex
                key={index}
                justify="space-between"
                align="center"
                style={{
                  borderRadius: "5px",
                  border: `1px solid gray`,
                  padding: "7px 15px",
                  marginRight: "10px",
                  boxShadow: `2px 2px 10px black`,
                }}
              >
                <Flex gap={10}>
                  <Icon component={UserOutlined} style={{ fontSize: 20 }} />
                  {`${interview.applicantName} ${interview.applicantMidname} ${interview.applicantLastname}`.toUpperCase()}
                </Flex>
                <Flex gap={16}>
                  <Button
                    title="Ver curricullum"
                    onClick={() => newTab(googleDocsViewer + interview.link)}
                    type="primary"
                    shape="circle"
                    icon={<FileTextFilled />}
                  />
                  <Button
                    title="Ver entrevista"
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
                    type="primary"
                    shape="circle"
                    icon={<WechatFilled style={{ fontSize: "20px" }} />}
                  />
                  {background && (
                    <Button
                      iconPosition="end"
                      onClick={() => toggleApproved(interview.fileId)}
                      style={{
                        width: "10rem",
                        backgroundColor: isApproved(interview.fileId)
                          ? "lightgreen"
                          : "lightpink",
                      }}
                    >
                      {isApproved(interview.fileId)
                        ? "Aprobado"
                        : "No aprobado"}
                    </Button>
                  )}
                  {background && (
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
                  )}
                </Flex>
              </Flex>
            );
          })
          .filter((_, i) => interviews[i].selected)}
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
