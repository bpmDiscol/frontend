import { Form } from "antd";
import React from "react";

function gimmeThaLinks(datastream, callback) {
  if (Object.keys(datastream).includes("links")) {
    const linksPromises = datastream.links.map(({ href }) =>
      Meteor.callAsync("get_link_data", { href })
    );
    Promise.all(linksPromises)
      .then((data) => callback(data[0]))
      .catch((error) => console.log(error));
  }
}

export default function InterviewView({ onClose, fileId, interviewForm }) {
  const [laboralExperience, setLaboralExperience] = React.useState();
  console.log("🚀 ~ InterviewView ~ laboralExperience:", laboralExperience)
  
  React.useEffect(() => {
    gimmeThaLinks(interviewForm, setLaboralExperience);
  },[]);

  return <div>Interview</div>;
}
