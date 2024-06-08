import React from "react";
import { Meteor } from "meteor/meteor";
import { NotificationsContext } from "../../../context/notificationsProvider";
import { Button, Drawer, Empty, Flex, Modal, Spin, Tooltip } from "antd";
import { EditFilled, FileTextFilled } from "@ant-design/icons";
import EmployeeRequestInterviewForm from "./employeeRequestInterviewForm";

export default function PositionInterviews() {
  const { openNotification } = React.useContext(NotificationsContext);
  const [interviews, setInterviews] = React.useState([]);
  const [cvPreview, setCvPreview] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [showDrawer, setShowDrawer] = React.useState(false);
  const [applicant, setApplicant] = React.useState();

  // const curricullums = useTracker(() => {
  //   Meteor.subscribe("curricullums");
  //   return curricullumCollection.find().fetch();
  // });
  // console.log(curricullums)

  function newTab(url) {
    let newTab = document.createElement("a");
    newTab.href = url;
    newTab.target = "_blank";
    newTab.click();
  }

  React.useEffect(() => {
    Meteor.callAsync("get_curricullums").then((response) => {
      if (response == "error") {
        openNotification(
          "error",
          "Error Critico",
          "Los datos que se solicitados no estan disponibles o se encuentran dañados"
        );
        return;
      }
      response.forEach(async (curricullum) => {
        Meteor.call(
          "get_file_link",
          { id: curricullum.fileId },
          (err, resp) => {
            if (!err) {
              setInterviews([
                ...interviews,
                { ...curricullum, link: resp[0]?.link },
              ]);
            }
          }
        );
      });
      setLoading(false);
    });
  }, []);

  return (
    <Flex gap={16} style={{ flex: 1 }}>
      <Flex gap={16} vertical style={{ width: "clamp(290px, 60lvw, 520px)" }}>
        <Spin spinning={loading} style={{ flex: 1 }}>
          {interviews.length == 0 && (
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
                    <Tooltip title={"Ver curricullum"}>
                      <Button
                        onClick={() => setCvPreview(interview.link)}
                        type="primary"
                        shape="circle"
                        icon={<FileTextFilled />}
                      />
                    </Tooltip>{" "}
                    <Tooltip title={"Llenar datos"}>
                      <Button
                        onClick={() => {
                          setApplicant(interview)
                          setShowDrawer(true);
                        }}
                        type="primary"
                        shape="circle"
                        icon={<EditFilled />}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
              );
            })}
        </Spin>
      </Flex>
      <Flex justify="center" style={{ flex: 1 }}>
        {cvPreview ? (
          <iframe type="application/pdf" src={cvPreview} style={{ flex: 1 }}>
            Error
          </iframe>
        ) : (
          <Empty description="Vista previa del currícullum" />
        )}
      </Flex>
      {applicant && (
        <Drawer
          title={`${applicant.applicantName} ${applicant.applicantMidname} ${applicant.applicantLastname}`.toUpperCase()}
          width={'70lvw'}
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
        >
          <EmployeeRequestInterviewForm />
        </Drawer>
      )}
    </Flex>
  );
}
