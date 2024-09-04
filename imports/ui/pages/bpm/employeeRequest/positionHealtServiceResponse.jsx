import React from "react";
import { Button, Drawer, Flex, Table, Typography } from "antd";
import {
  DownloadOutlined,
  EyeOutlined,
  FileTextFilled,
} from "@ant-design/icons";

import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";
import UploadHealthResponse from "../../../components/uploadHealthServiceResponse/index.jsx";
import { getTask, getTaskName } from "../../../config/taskManagement.js";

const googleDocsViewer = "http://docs.google.com/viewer?url=";

const closed = { applicant: null, open: false, view: null };
const { Text } = Typography;

export default function PositionHealthServiceResponse({
  curricullums,
  interviews,
}) {
  const [drawerData, setDrawerData] = React.useState(closed);
  const [currentHealthResponses, setCurrentHealthResponses] = React.useState();
  const [key, setNewkey] = React.useState(Math.random());

  React.useEffect(() => {
    Meteor.call(
      "get_task_data",
      getTaskName() + getTask(),
      Meteor.userId(),
      (err, resp) => {
        if (!err && resp?.length) {
          const bgs = resp[0].healthResponse;
          setCurrentHealthResponses(bgs);
        } else setCurrentHealthResponses({});
      }
    );
  }, []);

  function newTab(url) {
    let newTab = document.createElement("a");
    newTab.href = url;
    newTab.target = "_blank";
    newTab.click();
  }

  function handleClose() {
    setDrawerData(closed);
  }
  function setResponse(bg) {
    setNewkey(Math.random());
    setCurrentHealthResponses(bg);
  }

  function setNewHealthResponse(value, targetField, id) {
    const newBg = Object.assign(currentHealthResponses || {}, {
      [`${id}`]: value,
    });
    setResponse(newBg);
    Meteor.callAsync("update_Health_service_files", {
      taskId: getTaskName() + getTask(),
      id,
      HSFiles: value,
      user: Meteor.userId(),
    }).catch((error) => console.log(error));
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
            title="Examen ocupacional"
            render={(interview) => (
              <UploadHealthResponse
                currentHealthResponses={currentHealthResponses}
                setCurrentHealthResponses={setNewHealthResponse}
                targetField={"healthResponse"}
                id={interview.fileId}
              />
            )}
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
