import { Form } from "antd";
import React from "react";



export default function InterviewView({ onClose, fileId, interviewForm }) {
  React.useEffect(() => {

    

    const laboralExpPromises = interviewForm.links.map(({ href }) =>
      Meteor.callAsync("get_laboralExperience", { href })
    );

    Promise.all(laboralExpPromises)
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  });

  return <div>Interview</div>;
}
