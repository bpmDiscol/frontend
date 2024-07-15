import React from "react";
import { Button, Drawer, Empty, Flex } from "antd";
import Icon, {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditFilled,
  FileTextFilled,
  WarningOutlined,
  WechatFilled,
} from "@ant-design/icons";

import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";
import Transition from "../../../components/transition/index.jsx";
import UploadHealthResponse from "../../../components/uploadHealthServiceResponse/index.jsx";
import { getTask, getTaskName } from "../../../config/taskManagement.js";

const googleDocsViewer = "http://docs.google.com/viewer?url=";

const closed = { applicant: null, open: false, view: null };

export default function PositionHealthServiceResponse({
  curricullums,
  interviews,
  warningUsers,
}) {
  const [drawerData, setDrawerData] = React.useState(closed);
  const [currentHealthResponses, setCurrentHealthResponses] = React.useState();
  const [key, setNewkey] = React.useState(Math.random());

  React.useEffect(() => {
    Meteor.call("get_task_data", getTaskName() + getTask(), (err, resp) => {
      if (!err && resp?.length) {
        const bgs = resp[0].healthResponse;
        setCurrentHealthResponses(bgs);
        
      } else setCurrentHealthResponses({});
    });
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
    }).catch((error) => console.log(error));
  }

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Flex gap={16} vertical style={{ width: "clamp(290px, 60lvw, 520px)" }}>
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
                    border: `2px solid ${
                      interviews[index].selected
                        ? warningUsers.includes(interview.fileId)
                          ? "orange"
                          : "green"
                        : "red"
                    }`,
                    padding: "5px 10px",
                    boxShadow: `2px 2px 15px ${
                      interviews[index].selected ? "green" : "red"
                    }`,
                  }}
                >
                  <Flex
                    gap={10}
                    style={{
                      color: interviews[index].selected ? "green" : "red",
                    }}
                  >
                    <Icon
                      component={
                        interviews[index].selected
                          ? CheckCircleOutlined
                          : CloseCircleOutlined
                      }
                      style={{ fontSize: 20 }}
                    />
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

                    <UploadHealthResponse
                      currentHealthResponses={currentHealthResponses}
                      setCurrentHealthResponses={setNewHealthResponse}
                      targetField={"healthResponse"}
                      id={interview.fileId}
                    />
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
