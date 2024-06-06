import React from "react";
import { NotificationsContext } from "../../../context/notificationsProvider";
import { Flex } from "antd";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { curricullumCollection } from "../../../../api/curricullums/curricullumCollection";

export default function PositionInterviews() {
  const { openNotification } = React.useContext(NotificationsContext);
  const [interviews, setInterviews] = React.useState([]);

  // const curricullums = useTracker(() => {
  //   Meteor.subscribe("curricullums");
  //   return curricullumCollection.find().fetch();
  // });
  // console.log(curricullums)

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
    });
  }, []);

  return (
    <div>
      {interviews && interviews.map((interview) => {
        return (
          <Flex>
            {interview.applicantName}
            {interview.applicantMidname}
            {interview.applicantLastname}
            {interview.foundBy}
            <iframe type="application/pdf" src={interview.link}>
              Error
            </iframe>
          </Flex>
        );
      })}
    </div>
  );
}
