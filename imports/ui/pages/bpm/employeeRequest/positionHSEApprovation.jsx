import React from "react";
import { Button, Drawer, Flex, Table, Tooltip, Typography } from "antd";
import Icon, {
  DownloadOutlined,
  EyeOutlined,
  FileTextFilled,
  UserOutlined,
  WechatFilled,
} from "@ant-design/icons";

import InterviewView from "../../../components/interviewForm.jsx/interviewView.jsx";
import { NotificationsContext } from "../../../context/notificationsProvider.jsx";
import { getTask, getTaskName } from "../../../config/taskManagement.js";

const googleDocsViewer = "http://docs.google.com/viewer?url=";

const closed = { applicant: null, open: false, view: null };
const { Text } = Typography;

export default function PositionHSEApprovation({
  curricullums,
  interviews,
  checkeds,
  setCheckeds,
  requestEmployee,
  healthResponse,
}) {
  const [drawerData, setDrawerData] = React.useState(closed);
  const { openNotification } = React.useContext(NotificationsContext);
  const [hrLinks, setHRLinks] = React.useState();

  function newTab(url, download = false) {
    let newTab = document.createElement("a");
    newTab.href = url;
    newTab.download = download;
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

  function gethealthResponseLink(id) {
    const hr = hrLinks.filter((hr) => hr.id == healthResponse[id]._id)[0];
    return hr.link;
  }

  React.useEffect(() => {
    if (healthResponse) {
      const hrKeys = Object.keys(healthResponse);
      const hrPromises = hrKeys.map((hrKey) => {
        return Meteor.callAsync("getFileLink", {
          id: healthResponse[hrKey]._id,
          collectionName: "background",
        });
      });
      Promise.all(hrPromises)
        .then((res) => setHRLinks(res[0]))
        .catch((e) => console.log(e));
    }
  }, []);

  async function updateData(fileId, value) {
    const field = "healthResponse." + fileId + ".approved";
    await Meteor.callAsync("update_task", {
      taskId: getTaskName() + getTask(),
      field,
      value,
      user: Meteor.userId(),
    }).catch((e) => console.log(e));
  }

  function handleCandidate(curricullumId) {
    if (isInList(curricullumId)) {
      deleteCandidate(curricullumId);
      updateData(curricullumId, false);
    } else {
      addCandidate(curricullumId);
      updateData(curricullumId, true);
    }
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
            title="Estado"
            render={(interview) => (
              <Button
                style={{
                  width: "10rem",
                  backgroundColor: checkeds.includes(interview.fileId)
                    ? "lightgreen"
                    : "lightpink",
                }}
                onClick={() => handleCandidate(interview.fileId)}
              >
                {checkeds.includes(interview.fileId)
                  ? "Aprobado"
                  : "No aprobado"}
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
