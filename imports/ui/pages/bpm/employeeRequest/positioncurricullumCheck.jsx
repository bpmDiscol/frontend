import React from "react";
import { Button, Drawer, Flex } from "antd";
import Icon, {
  CheckOutlined,
  FileTextFilled,
  UserOutlined,
  WarningOutlined,
  WechatFilled,
} from "@ant-design/icons";

import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";
import Transition from "../../../components/transition/index.jsx";
import { NotificationsContext } from "../../../context/notificationsProvider.jsx";

const googleDocsViewer = "http://docs.google.com/viewer?url=";

const closed = { applicant: null, open: false, view: null };

export default function PositionCurricullumCheck({
  curricullums,
  interviews,
  checkeds,
  setCheckeds,
  requestEmployee,
}) {
  const [drawerData, setDrawerData] = React.useState(closed);
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

  function addCandidate(curricullumId) {
    if (requestEmployee.vacancies <= checkeds.length) {
      openNotification(
        "info",
        "Para su información",
        "Recuerda que el numero maximo de vacantes es de " +
          requestEmployee.vacancies
      );
      return;
    }
    setCheckeds([...checkeds, curricullumId]);
  }
  function deleteCandidate(curricullumId) {
    setCheckeds(checkeds.filter((id) => id != curricullumId));
  }
  function isInList(curricullumId) {
    return checkeds.includes(curricullumId);
  }

  function handleCandidate(curricullumId) {
    if (isInList(curricullumId)) deleteCandidate(curricullumId);
    else addCandidate(curricullumId);
  }

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Flex gap={16} vertical style={{ width: "clamp(290px, 60lvw, 520px)" }}>
        {curricullums
          ?.map((interview, index) => {
            return (
              <Flex
                key={index}
                justify="space-between"
                align="center"
                style={{
                  borderRadius: "5px",
                  border: `1px solid ${
                    checkeds.includes(interview.fileId) ? "green" : "gray"
                  }`,
                  padding: "5px 10px",
                  boxShadow: `2px 2px 15px ${
                    checkeds.includes(interview.fileId) ? "green" : "gray"
                  }`,
                }}
              >
                <Flex
                  gap={10}
                  style={{
                    color: checkeds.includes(interview.fileId)
                      ? "green"
                      : "black",
                  }}
                >
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
                  <Button
                    title="Seleccionar este candidato"
                    type="primary"
                    shape="circle"
                    icon={
                      <CheckOutlined
                        style={{
                          fontSize: checkeds.includes(interview.fileId)
                            ? 20
                            : 14,
                        }}
                      />
                    }
                    onClick={() => handleCandidate(interview.fileId)}
                  />
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
