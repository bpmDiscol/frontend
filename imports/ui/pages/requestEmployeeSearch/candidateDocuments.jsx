import { Avatar, Flex, List } from "antd";
import React from "react";
import translate from "../../misc/translate.json";

export default function CandidateDocuments({ id, backgrounds, cvFiles }) {
  const [background, setBackground] = React.useState();
  const [curricullumFiles, setCurricullumFiles] = React.useState();
  const [cv, setCV] = React.useState();
  async function getCVfile(id) {
    Meteor.call(
      "getFileLink",
      {
        id,
        collectionName: "curricullums",
      },
      (err, resp) => {
        if (err) console.log(err);
        else setCV({ ...resp[0], name: "Curricullum" });
      }
    );
  }

  function getIdFileName(fileId, target) {
    if (!Object.keys(target).includes(id)) return;
    const myBGFiles = target[id];
    return Object.keys(myBGFiles).find((key) => myBGFiles[key]._id === fileId);
  }

  function getLinks(id, target, collectionName, setter) {
    if (!target) {
      setter(null);
      return;
    }
    if (!Object.keys(target).includes(id)) {
      setter(null);
      return;
    }
    const myFiles = target[id];
    const bgPromises = Object.keys(myFiles).map((key) =>
      Meteor.callAsync("getFileLink", {
        id: myFiles[key]._id,
        collectionName,
      })
    );
    Promise.all(bgPromises)
      .then((resp) => resp.filter((r) => r.length))
      .then((resp) => {
        setter(
          resp.map((r) => {
            return {
              link: r[0].link,
              name: translate[getIdFileName(r[0].id, target)],
            };
          })
        );
      })
      .catch((e) => console.log(e));
  }

  React.useEffect(() => {
    getLinks(id, backgrounds, "background", setBackground);
    getLinks(id, cvFiles, "background", setCurricullumFiles);
    getCVfile(id);
  }, [id]);

  function ListFiles({ source }) {
    return (
      <List
        dataSource={source}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`/stationery.png`} />}
              title={
                <a href={item?.link} target="_blank">
                  {item?.name}
                </a>
              }
              description={
                <Flex gap={16}>
                  <a href={item?.link} download={true}>
                    Descargar
                  </a>
                  <a
                    href={"http://docs.google.com/viewer?url=" + item?.link}
                    target="_blank"
                  >
                    Ver
                  </a>
                </Flex>
              }
            />
          </List.Item>
        )}
      />
    );
  }

  return (
    <Flex vertical>
      {cv && <ListFiles source={[cv]} />}
      {background && <ListFiles source={background} />}
      {curricullumFiles && <ListFiles source={curricullumFiles} />}
    </Flex>
  );
}
