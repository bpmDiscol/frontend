import React, { useContext, useEffect, useState } from "react";
import { getContratationDates, getProcessLine } from "./contratations";
import { Badge, Card, Flex, Select, Steps, Tag, Typography } from "antd";
import { MainViewContext } from "../../context/mainViewProvider";
import moment from "moment";
import { FileDoneOutlined, LoadingOutlined } from "@ant-design/icons";
import translate from "../../misc/translate.json";
import getDirectorAreas from "../../misc/getDirectorAreas";

const { Title } = Typography;

export default function LeaderTimeLine({ approvations, requestProcess }) {
  const { userName } = useContext(MainViewContext);
  const [myProcesses, setMyProcesses] = useState([]);
  const [dates, setDates] = React.useState();
  const [currentDate, setCurrentDate] = useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const dates = getContratationDates(approvations, requestProcess).reverse();
    setDates(dates);
    setCurrentDate(dates[0]?.value);
  }, [approvations, requestProcess]);

  function getMyProcesses() {
    return getProcessLine(
      null,
      currentDate,
      approvations,
      requestProcess,
      userName,
      getDirectorAreas(Meteor.userId())
    );
  }

  function getMyStep(item) {
    return {
      status: item.status,
      icon:
        item.status === "finish" ? (
          <FileDoneOutlined style={{ color: "green" }} />
        ) : (
          <LoadingOutlined />
        ),
      title: (
        <Badge
          status={item.responsible === "undefined" ? "processing" : "success"}
          text={translate[item.taskName]}
          size="small"
        />
      ),
      subTitle: (
        <Flex vertical gap={10}>
          <Tag color="#2db7f5">{item.area}</Tag>
          {item.responsible !== "undefined" && (
            <Tag color="gold">{item.responsible}</Tag>
          )}
        </Flex>
      ),
      description: item.status === "finish" ? `Terminado` : "En proceso...",
    };
  }

  useEffect(() => {
    if (currentDate) {
      setMyProcesses(getMyProcesses());
      setLoading(false);
    }
  }, [currentDate]);

  return (
    <Flex vertical gap={20} style={{ width: "98%", marginTop: "20px" }}>
      <Card bordered style={{ border: "1px solid" }}>
        <Title>Requisiciones de este mes</Title>
        {dates?.length && (
          <Select
            options={dates}
            defaultValue={dates[0].value}
            onChange={(value) => setCurrentDate(value)}
          />
        )}
        {myProcesses.map((process, inx) => {
          return (
            <Card
              style={{ marginTop: "16px", border: "1px solid gray" }}
              bordered
              key={inx}
              title={
                <Flex>
                  <Tag>{process.requestArea}</Tag>
                  <Tag>{process.placeName}</Tag>
                  <Tag>
                    Inicio: {moment(process.createdAt).format("DD/MM/YYYY")}
                  </Tag>
                </Flex>
              }
            >
              <Flex
                style={{ overflowY: "auto", width: "70dvw", padding: "20px" }}
              >
                <Flex>
                  <Steps
                    size="small"
                    style={{ overflowY: "auto" }}
                    items={process.steps.map(getMyStep)}
                    labelPlacement="horizontal"
                  />
                </Flex>
              </Flex>
            </Card>
          );
        })}
        {loading && (
          <Flex style={{ paddingTop: "16px" }}>Cargando recursos...</Flex>
        )}
        {!myProcesses?.length && !loading && (
          <Flex style={{ paddingTop: "16px" }}>
            Sin procesos para mostrar en este mes 
          </Flex>
        )}
      </Card>
    </Flex>
  );
}
