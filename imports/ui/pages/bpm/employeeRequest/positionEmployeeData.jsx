import { DownloadOutlined, FileTextFilled } from "@ant-design/icons";
import { Button, Flex, List, Typography } from "antd";
import React from "react";
import { NotificationsContext } from "../../../context/notificationsProvider";

import cvFields from "../data/cvfields.json";

const googleDocsViewer = "http://docs.google.com/viewer?url=";

export default function PositionEmployeeData({ requestEmployee, buttons }) {
  const { openNotification } = React.useContext(NotificationsContext);
  const { Text } = Typography;

  function newTab(url, download = false) {
    const newTab = document.createElement("a");
    newTab.href = download ? url : googleDocsViewer + url;
    newTab.target = "_blank";
    newTab.download = download;
    newTab.click();
  }

  async function getFile(id, collectionName, download = false) {
    const link = await await Meteor.callAsync("getFileLink", {
      id,
      collectionName,
    }).catch((e) => {
      openNotification(
        "error",
        "Error al descargar el archivo",
        "Posiblemente se trate de un error en la red, espera un momento e intentalo nuevamente"
      );
      console.log(e);
      return;
    });

    if (link.length) newTab(link[0].link, download);
    else
      openNotification(
        "warning",
        "Archivo no disponible",
        "El archivo no se encuentra en la base de datos, posiblemente no fue cargado correctamente",
        "",
        "",
        5
      );
  }

  function getFileIdByItemname(itemName, memberId) {
    if (cvFields.includes(itemName)) {
      //field from cvFilesInput
      try {
        return requestEmployee.cvFilesInput[memberId][itemName]._id;
      } catch (e) {
        return;
      }
    }
  }
  return (
    <Flex vertical>
      <Flex gap={16} style={{padding:10}}>
        <Text>Area: {requestEmployee.area_proyect}</Text>
        <Text>{`Cargo: ${requestEmployee.companyPosition}`}</Text>
      </Flex>
      <List
        dataSource={requestEmployee.curricullumsInput}
        renderItem={(member, index) => (
          <List.Item
            style={{
              border: "1px solid black",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <List.Item.Meta
              title={`${member.applicantName} ${member.applicantMidname} ${member.applicantLastname}`.toUpperCase()}
              description={
                "Identificación: " + requestEmployee.interviewInput[index].id
              }
            />
            <Flex gap={16}>
              {buttons?.background &&
                buttons?.background.map((item) => (
                  <Button
                    title={item.title}
                    type="primary"
                    shape="round"
                    icon={<DownloadOutlined />}
                    id={item.linkId}
                    key={item.linkId}
                    onClick={() =>
                      getFile(
                        getFileIdByItemname(item.linkId, member.fileId),
                        "background",
                        true
                      )
                    }
                  >
                    {item.title}
                  </Button>
                ))}
              {buttons?.curricullum && (
                <Button
                  title={"Ver currivullum"}
                  type="primary"
                  shape="round"
                  icon={<FileTextFilled />}
                  id={"cufricullum-button"}
                  onClick={() => getFile(member.fileId, "curricullums")}
                >
                  Ver Curricullum
                </Button>
              )}
            </Flex>
          </List.Item>
        )}
      />
    </Flex>
  );
}
