import React from "react";
import UploadFileButton from "../../../components/uploadFileButton";
import { Flex, Typography } from "antd";
import { getCase } from "../../../config/taskManagement";

import translate from "../../../misc/translate.json";

export default function PositionLastDocuments({ member, requestEmployee }) {
  const { Text } = Typography;
  const memberId = member.interviewId;
  const myDocuments = requestEmployee.cvFilesInput[memberId] || {};

  function setCurrentCVFiles(value, targetField) {
    const newBg = Object.assign(myDocuments || {}, {
      [`${targetField}`]: value,
    });
    Meteor.callAsync("uploadNominaFiles", getCase(), newBg, memberId).catch(
      (error) => console.log(error)
    );
  }

  const currentFile = (targetField) => {
    return Object.keys(myDocuments).includes(targetField)
      ? myDocuments[`${targetField}`]
      : null;
  };

  function defaultFile(linkId) {
    const current = currentFile(linkId);
    return current?._id
      ? [
          {
            uid: current?._id,
            name: current?.name,
            status: "done",
          },
        ]
      : undefined;
  }

  function onLoad(file, targetField) {
    setCurrentCVFiles({ _id: file?.uid, name: file?.name }, targetField);
  }

  return (
    <Flex gap={16}>
      {[
        "certificado_eps",
        "certificado_arl",
        "certificado_pensiones",
        "certificado_banco",
      ].map((linkId) => (
        <Flex vertical align="center" justify="center">
          <UploadFileButton
            key={linkId + "_button"}
            id={linkId + "_button"}
            targetCollection={"background"}
            onUpload={(file) => onLoad(file, linkId)}
            defaultFileShow={defaultFile(linkId)}
          />
          <Text style={{color:defaultFile(linkId) ? "gray" : "red", fontSize:'11px'}}>
            {translate[linkId]}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
