import React from "react";
import { Button, Drawer, Empty, Flex } from "antd";
import {
  DownloadOutlined,
  EditFilled,
  FileTextFilled,
} from "@ant-design/icons";
import InterviewForm from "../../../components/interviewForm.jsx";

const googleDocsViewer = "http://docs.google.com/viewer?url=";

export default function PositionInterviews({ update, interviews }) {
  const [drawerData, setDrawerData] = React.useState({
    open: false,
    applicant: null,
  });

  function newTab(url, download = false) {
    const newTab = document.createElement("a");
    newTab.href = url;
    newTab.target = "_blank";
    newTab.download = download;
    newTab.click();
  }

  function handleClose() {
    setDrawerData({ applicant: null, open: false });
  }

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Flex gap={16} vertical style={{ width: "clamp(290px, 60lvw, 520px)" }}>
        {interviews && !interviews?.length && (
          <Empty description="Cargando currícullums..." />
        )}
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
                    onClick={() => newTab(interview.link, true)}
                    type="primary"
                    shape="circle"
                    icon={<DownloadOutlined />}
                    id="download-cv"
                  />
                  <Button
                    loading={!interview.link}
                    title="Ver curricullum"
                    id="watch-cv-button"
                    onClick={() => newTab(googleDocsViewer + interview.link)}
                    type="primary"
                    shape="circle"
                    icon={<FileTextFilled />}
                  />
                  <Button
                    title="Llenar entrevista"
                    id="fill-interview-button"
                    onClick={() => {
                      setDrawerData({
                        applicant: interview,
                        open: true,
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
        {drawerData.applicant && (
          <InterviewForm
            update={update}
            onClose={handleClose}
            fileId={drawerData.applicant?.fileId}
          />
        )}
      </Drawer>
    </Flex>
  );
}
