import React from "react";
import { Button, Drawer, Empty, Flex, Spin } from "antd";
import { EditFilled, FileTextFilled } from "@ant-design/icons";
import InterviewForm from "../../../components/interviewForm.jsx";

export default function PositionInterviews({ update, interviews }) {
  const [cvPreview, setCvPreview] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [drawerData, setDrawerData] = React.useState({
    open: false,
    applicant: null,
  });

  function newTab(url) {
    let newTab = document.createElement("a");
    newTab.href = url;
    newTab.target = "_blank";
    newTab.click();
  }

  function handleClose() {
    setDrawerData({ applicant: null, open: false });
  }

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Spin spinning={loading} fullscreen />
      <Flex gap={16} vertical style={{ width: "clamp(290px, 60lvw, 520px)" }}>
        {interviews && interviews.length == 0 && (
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
                    onClick={() => setCvPreview(interview.link)}
                    type="primary"
                    shape="circle"
                    icon={<FileTextFilled />}
                  />
                  <Button
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
      <Flex justify="center" style={{ flex: 1 }}>
        {cvPreview ? (
          <iframe src={cvPreview} style={{ flex: 1 }} frameborder="0"></iframe>
        ) : (
          <Empty description="Vista previa del currícullum" />
        )}
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
