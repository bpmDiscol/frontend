import React from "react";
import UploadFileButton from "../uploadFileButton";

export default function UploadHealthResponse({
  targetField,
  currentHealthResponses,
  setCurrentHealthResponses,
  id,
}) {
  const currentFile = Object.keys(currentHealthResponses || {}).includes(id)
    ? currentHealthResponses[`${id}`]
    : null;

  function onLoad(file) {
    setCurrentHealthResponses(
      { _id: file.uid, name: file.name },
      targetField,
      id
    );
  }

  return (
    <UploadFileButton
      targetCollection={"background"}
      onUpload={onLoad}
      defaultFileShow={
        currentFile
          ? [
              {
                uid: currentFile?._id,
                name: currentFile?.name,
                status: "done",
              },
            ]
          : undefined
      }
    />
  );
}
