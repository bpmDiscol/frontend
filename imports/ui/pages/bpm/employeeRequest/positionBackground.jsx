import React from "react";
import { Button, Drawer, Flex, Select, Space } from "antd";
import Icon, {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FileTextFilled,
  WarningOutlined,
} from "@ant-design/icons";

import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";
import Transition from "../../../components/transition/index.jsx";
import UploadFileButton from "../../../components/uploadFileButton/index.jsx";
import { getTask, getTaskName } from "../../../config/taskManagement.js";

const googleDocsViewer = "http://docs.google.com/viewer?url=";

const closed = { applicant: null, open: false, view: null };

export default function PositionBackgroud({
  curricullums,
  interviews,
  warningUsers,
}) {
  const [background, setBackground] = React.useState();
  const [taskId, setTaskId] = React.useState();
  const [drawerData, setDrawerData] = React.useState(closed);
  const [subordinates, setSubordinates] = React.useState([]);

  function newTab(url, download = false) {
    const newTab = document.createElement("a");
    newTab.href = url;
    newTab.target = "_blank";
    newTab.download = download;
    newTab.click();
  }

  function handleClose() {
    setDrawerData(closed);
  }

  async function updateData(field, value) {
    await Meteor.callAsync("update_task", {
      taskId,
      field,
      value,
      user: Meteor.userId(),
    }).catch((e) => console.log(e));
  }

  function checkPreFile(id) {
    const currentBackgound = Object.keys(background).includes(id);
    if (currentBackgound)
      return Object.keys(background[id]).includes("legal_background")
        ? background[id].legal_background
        : undefined;
  }

  function toggleApproved(id) {
    const currentCandidate = { ...background[id] };
    const currentState = currentCandidate?.approved;
    const updatedCandidate = { ...currentCandidate, approved: !currentState };
    setBackground({ ...background, [id]: updatedCandidate });
    updateData(`${id}.approved`, !currentState);
  }

  function isApproved(id) {
    if (!background) return false;
    const isPresent = Object.keys(background).includes(id);
    if (!isPresent) return;
    return background[id].approved;
  }
  async function getSubordinates() {
    return await Meteor.callAsync(
      "get_subordinates",
      Meteor.userId(),
      sessionStorage.getItem("constId")
    ).catch((e) => console.log(e));
  }
  async function getSubordinateLabels() {
    const raw = await getSubordinates();
    return raw.map((subordinate) => {
      return {
        label: subordinate.userName,
        value: parseInt(subordinate.id),
      };
    });
  }

  React.useEffect(() => {
    const taskId = getTaskName() + getTask();
    setTaskId(taskId);
    Meteor.call("get_task_data", taskId, Meteor.userId(), (err, resp) => {
      if (!err && resp) setBackground(resp[0]);
    });
    getSubordinateLabels().then((labels) => setSubordinates(labels));
  }, []);

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Flex gap={16} vertical style={{ width: "clamp(290px, 60lvw, 60dvw)" }}>
        <Flex justify="end" align="center" gap={10}>
          Asignado a:
          <Select
            placeholder="Selecciona un auxiliar"
            options={subordinates}
            filterOption
            style={{ width: "15rem" }}
            onChange={(value) => updateData("auxiliarId", value)}
          />
        </Flex>

        {curricullums &&
          curricullums
            .map((interview, index) => {
              return (
                <Flex
                  key={index}
                  justify="space-between"
                  align="center"
                  style={{
                    borderRadius: "5px",
                    border: `2px solid`,
                    padding: "7px 15px",
                    marginRight: "10px",
                  }}
                >
                  <Flex
                    gap={10}
                    style={{
                      color: isApproved(interview.fileId) ? "green" : "red",
                      fontWeight: "bolder",
                    }}
                  >
                    <Icon
                      component={
                        isApproved(interview.fileId)
                          ? CheckCircleOutlined
                          : CloseCircleOutlined
                      }
                      style={{ fontSize: 20 }}
                    />
                    {`${interview.applicantName} ${interview.applicantMidname} ${interview.applicantLastname}`.toUpperCase()}
                  </Flex>
                  <Flex gap={16}>
                    <Button
                      onClick={() => newTab(interview.link, true)}
                      title="Descargar curricullum"
                      type="primary"
                      shape="circle"
                      icon={<DownloadOutlined />}
                      id="download-cv"
                    />
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
                      icon={
                        <img
                          src="/icons/speaking.svg"
                          style={{ width: "1.5rem" }}
                        />
                      }
                    />
                    {background && (
                      <UploadFileButton
                        targetCollection={"background"}
                        onUpload={(uploadData) =>
                          updateData(
                            `${interview.fileId}.legal_background`,
                            uploadData
                          )
                        }
                        defaultFileShow={
                          checkPreFile(interview.fileId)
                            ? [checkPreFile(interview.fileId)]
                            : undefined
                        }
                      />
                    )}
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
                  </Flex>
                  <Flex style={{ position: "absolute", right: "10%" }}>
                    {warningUsers.includes(interview.fileId) && (
                      <Transition effect={"zoom-in"}>
                        <WarningOutlined
                          style={{ color: "orange", fontSize: "2rem" }}
                        />
                      </Transition>
                    )}
                  </Flex>
                </Flex>
              );
            })
            .filter((_, i) => interviews[i].selected)}
      </Flex>
      <Drawer
        title={`${drawerData.applicant?.applicantName} ${drawerData.applicant?.applicantMidname} ${drawerData.applicant?.applicantLastname}`.toUpperCase()}
        width={"100lvw"}
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
