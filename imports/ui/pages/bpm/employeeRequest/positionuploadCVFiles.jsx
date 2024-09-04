import React from "react";
import { Button, Drawer, Flex, Table, Typography } from "antd";
import Icon, {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  EditFilled,
  EyeOutlined,
  FileTextFilled,
  WarningOutlined,
  WechatFilled,
} from "@ant-design/icons";

import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";
import Transition from "../../../components/transition/index.jsx";
import CVFilesForm from "../../../components/CVFilesForm/index.jsx";

const googleDocsViewer = "http://docs.google.com/viewer?url=";

const closed = { applicant: null, open: false, view: null };
const { Text } = Typography;

export default function PositionUploadCVFiles({
  curricullums,
  interviews,
  warningUsers,
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
            title="Documentos"
            render={(interview, _, index) => (
              <Button
                onClick={() => {
                  setDrawerData({
                    applicant: interview,
                    open: true,
                    view: <CVFilesForm id={interview.fileId} />,
                  });
                }}
                danger={warningUsers.includes(interview.fileId)}
                icon={
                  warningUsers.includes(interview.fileId) ? (
                    <Transition effect={"zoom-in"}>
                      <WarningOutlined
                        style={{ color: "red", fontSize: "1.2rem" }}
                      />
                    </Transition>
                  ) : (
                    <CloudUploadOutlined />
                  )
                }
                type="link"
              >
                Cargar
              </Button>
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
