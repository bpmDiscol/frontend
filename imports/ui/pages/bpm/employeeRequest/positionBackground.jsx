import React from "react";
import { Button, Drawer, Flex, Select, Space, Table, Typography } from "antd";
import {
  DownloadOutlined,
  EyeOutlined,
  FileTextFilled,
  WarningOutlined,
} from "@ant-design/icons";

import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";
import Transition from "../../../components/transition/index.jsx";
import UploadFileButton from "../../../components/uploadFileButton/index.jsx";
import { getTask, getTaskName } from "../../../config/taskManagement.js";

const googleDocsViewer = "http://docs.google.com/viewer?url=";
const { Text } = Typography;

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
      <Flex gap={16} vertical style={{ width: "100%" }}>
        <Flex justify="start" align="center" gap={10}>
          Asignado a:
          <Select
            placeholder="Selecciona un auxiliar"
            options={subordinates}
            filterOption
            style={{ width: "15rem" }}
            onChange={(value) => updateData("auxiliarId", value)}
            id="auxiliarId"
          />
        </Flex>
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
            title="Estado"
            width={"7rem"}
            render={(interview) => (
              <Button
                iconPosition="end"
                onClick={() => toggleApproved(interview.fileId)}
                style={{
                  width: "7rem",
                  backgroundColor: isApproved(interview.fileId)
                    ? "lightgreen"
                    : "lightpink",
                }}
              >
                {isApproved(interview.fileId) ? "Aprobado" : "No aprobado"}
              </Button>
            )}
          />
          <Table.Column
            title="Archivos"
            width={"8rem"}
            render={(interview) =>
              background && (
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
          <Table.Column
            render={(interview) => (
              <Flex>
                {warningUsers.includes(interview.fileId) && (
                  <Transition effect={"zoom-in"}>
                    <WarningOutlined
                      style={{ color: "orange", fontSize: "2rem" }}
                    />
                  </Transition>
                )}
              </Flex>
            )}
          />
        </Table>
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
