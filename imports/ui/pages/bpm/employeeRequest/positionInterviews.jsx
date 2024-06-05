import React from "react";
import { NotificationsContext } from "../../../context/notificationsProvider";
import { Flex } from "antd";

export default function PositionInterviews() {
  const { openNotification } = React.useContext(NotificationsContext);
  const [interviews, setInterviews] = React.useState([]);

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
      setInterviews(response);
      console.log(response);
    });
  }, []);
  return (
    <div>
      {interviews.map((interview) => {
        return (
          <Flex>
            {interview.applicantName}
            {interview.applicantMidname}
            {interview.applicantLastname}
            {interview.foundBy}
            {/* <iframe type="application/pdf" src={curricullumLink}>
              Error
            </iframe> */}
          </Flex>
        );
      })}
    </div>
  );
}
