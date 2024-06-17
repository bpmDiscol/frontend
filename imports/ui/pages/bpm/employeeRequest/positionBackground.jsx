import React from "react";
import { Button, Drawer, Empty, Flex } from "antd";
import { EditFilled, FileTextFilled, WechatFilled } from "@ant-design/icons";

import BackgroundForm from "../../../components/backgroundForm/index.jsx";
import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";

const googleDocsViewer = "http://docs.google.com/viewer?url=";

const closed = { applicant: null, open: false, view: null };
export default function PositionBackgroud({
  update,
  interviews,
  interviewForms,
}) {
  const [drawerData, setDrawerData] = React.useState(closed);

  function newTab(url) {
    let newTab = document.createElement("a");
    newTab.href = url;
    newTab.target = "_blank";
    newTab.click();
  }

  function handleClose() {
    setDrawerData(closed);
  }

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Flex gap={16} vertical style={{ width: "clamp(290px, 60lvw, 520px)" }}>
        {interviews &&
          interviews.map((interview, index) => {
            return (
              <Flex
                key={index}
                justify="space-between"
                align="center"
                style={{
                  borderRadius: "5px",
                  border: "1px solid blue",
                  padding: "5px 10px",
                  boxShadow: "none",
                }}
              >
                {`${interview.applicantName} ${interview.applicantMidname} ${interview.applicantLastname}`.toUpperCase()}
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
                            interviewForm={interviewForms[index]}
                          />
                        ),
                      });
                    }}
                    type="primary"
                    shape="circle"
                    icon={<WechatFilled style={{ fontSize: "20px" }} />}
                  />
                  <Button
                    title="Llenar antecedentes"
                    onClick={() => {
                      setDrawerData({
                        applicant: interview,
                        open: true,
                        view: <BackgroundForm />,
                      });
                    }}
                    type="primary"
                    shape="circle"
                    icon={<EditFilled />}
                  />
                </Flex>
              </Flex>
            );
          })}
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
