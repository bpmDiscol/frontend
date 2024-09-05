import React from "react";
import { Badge, Card, Flex, Pagination, Steps, Tag, Typography } from "antd";
import TimeCounter from "../timeCounter";
import translate from "../../misc/translate.json";
import { FileDoneOutlined, FileSyncOutlined } from "@ant-design/icons";
import moment from "moment";

export default function StepsLines({ processLines }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentSteps, setCurrentSteps] = React.useState();
  const [currentData, setCurrentData] = React.useState();
  const { Text } = Typography;

  function fetchData() {
    const currentSteps = currentData?.steps.map((item) => {
      return {
        status: item.status,
        icon:
          item.status === "finish" ? (
            <FileDoneOutlined style={{ color: "green" }} />
          ) : (
            <FileSyncOutlined />
          ),
        title: (
          <Badge
            status={item.responsible === "undefined" ? "processing" : "success"}
            text={translate[item.taskName]}
          />
        ),
        subTitle: (
          <Flex gap={10}>
            <Tag color="#2db7f5">{item.area}</Tag>
            {item.responsible !== "undefined" && (
              <Tag color="gold">{item.responsible}</Tag>
            )}
          </Flex>
        ),
        description:
          item.status === "finish" ? (
            `Terminado el ${moment(item.endDate).format('DD/MM/YYYY')} en: ${item.totalTime}`
          ) : (
            <TimeCounter startDate={item.startDate} />
          ),
      };
    });
    setCurrentSteps(currentSteps);
  }

  React.useEffect(() => {
    setCurrentData(processLines[0]);
  }, [processLines]);

  React.useEffect(() => {
    setCurrentData(processLines[currentPage - 1]);
  }, [currentPage]);

  React.useEffect(() => {
    fetchData();
  }, [currentData]);

  return (
    processLines && (
      <Flex vertical gap={10} className="showme" style={{ flex: 1 }}>
        <Flex gap={10}>
          <Flex
            justify="center"
            align="center"
            vertical
            style={{
              borderRadius: "10px",
              border: "1px solid",
              padding: "5px 15px",
            }}
          >
            <Text>
              {currentData?.isFinished
                ? "Finalizado en"
                : "En proceso desde hace"}
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              <TimeCounter
                startDate={currentData?.createdAt}
                endDate={
                  currentData?.isFinished ? currentData?.modifyedAt : null
                }
              />
            </Text>
          </Flex>
          <Flex
            justify="center"
            align="center"
            vertical
            style={{
              flex: 1,
              borderRadius: "10px",
              border: "1px solid",
              padding: "5px 15px",
            }}
          >
            <Text>{currentData?.initiator.toUpperCase()} solicita</Text>
            <Text strong style={{ fontSize: "16px" }}>
              {`${currentData?.placeName} (${currentData?.places})`}
            </Text>
          </Flex>
        </Flex>
        <Flex align="center">
          <Typography.Text>
            Procesos en {currentData?.requestArea}
          </Typography.Text>
          <Pagination
            size="small"
            pageSize={1}
            total={processLines.length}
            onChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </Flex>
        <Card
          className={"showme"}
          style={{
            border: "1px solid",
            width: "100%",
            height: "45dvh",
            overflow: "auto",
          }}
        >
          {currentSteps && (
            <Steps
              size="small"
              direction="vertical"
              current={1}
              items={currentSteps}
            />
          )}
        </Card>
      </Flex>
    )
  );
}
