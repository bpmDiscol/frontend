import React, { useEffect } from "react";
import { Button, Drawer, Empty, Flex, Table, Typography } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteFilled,
  DownloadOutlined,
  FileTextFilled,
  FormOutlined,
} from "@ant-design/icons";
import InterviewForm from "../../../components/interviewForm.jsx";
import { getTask, getTaskName } from "../../../config/taskManagement.js";

const { Text } = Typography;
const googleDocsViewer = "http://docs.google.com/viewer?url=";

export default function PositionInterviews({ interviews, requestEmployee }) {
  const [selections, setSelections] = React.useState({});
  const [drawerData, setDrawerData] = React.useState({
    open: false,
    applicant: null,
  });

  const [MyInterviews, setMyInterviews] = React.useState(
    interviews?.filter((i) => i.isSelected)
  );
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

  async function discard(fileId) {
    const newInterviews = MyInterviews.filter((it) => it.fileId !== fileId);
    setMyInterviews(newInterviews);

    await Meteor.callAsync("update_selected", {
      isSelected: false,
      fileId,
      taskId: getTaskName() + getTask(),
    }).catch((error) => console.error(error));
  }
  useEffect(() => {
    const taskId = getTaskName() + getTask();
    Meteor.call("get_task_data", taskId, Meteor.userId(), (err, resp) => {
      if (err) return;
      const myOldSelections = {};
      Object.keys(resp[0]).forEach(
        (data) => (myOldSelections[data] = resp[0][data].selected)
      );
      setSelections(myOldSelections);
    });
  }, []);

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Flex gap={16} vertical style={{ width: "100%" }}>
        {interviews && !interviews?.length && (
          <Empty description="Cargando currícullums..." />
        )}
        <Table
          dataSource={MyInterviews}
          pagination={false}
          style={{ width: "100%" }}
          rowKey={(record) => record.fileId}
        >
          <Table.Column
            render={(interview) =>
              selections[interview?.fileId] ? (
                <CheckCircleOutlined style={{ color: "green", fontSize: 20 }} />
              ) : (
                <CloseCircleOutlined style={{ color: "red", fontSize: 20 }} />
              )
            }
          />
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
            render={(interview) => (
              <Button
                onClick={() => newTab(interview.link, true)}
                icon={<DownloadOutlined />}
                type="link"
              >
                Descargar curricullum
              </Button>
            )}
          />
          <Table.Column
            render={(interview) => (
              <Button
                onClick={() => newTab(googleDocsViewer + interview.link)}
                icon={<FileTextFilled />}
                type="link"
              >
                Ver curricullum
              </Button>
            )}
          />
          <Table.Column
            render={(interview) => (
              <Button
                onClick={() => {
                  setDrawerData({
                    applicant: interview,
                    open: true,
                  });
                }}
                icon={<FormOutlined />}
                type="link"
              >
                Llenar entrevista
              </Button>
            )}
          />
          <Table.Column
            render={(_, record) => (
              <Button
                icon={<DeleteFilled />}
                danger
                type="primary"
                onClick={() => discard(record.fileId)}
              >
                Descartar
              </Button>
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
        {drawerData.applicant && (
          <InterviewForm
            setSelections={setSelections}
            onClose={handleClose}
            fileId={drawerData.applicant?.fileId}
            requestEmployee={requestEmployee}
          />
        )}
      </Drawer>
    </Flex>
  );
}
