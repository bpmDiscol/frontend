import React from "react";
import {
  Badge,
  Card,
  Flex,
  Pagination,
  Steps,
  Typography,
} from "antd";
import TimeCounter from "../timeCounter";
import translate from "../../misc/translate.json"

export default function StepsLines({ processLines }) {
  //   const [currentData, setCurrentData] = React.useState();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentSteps, setCurrentSteps] = React.useState();
  const currentData = processLines[currentPage - 1];
  const { Text, Title } = Typography;
  React.useEffect(() => {
    const currentSteps = currentData.steps.map((item) => {
      return {
        status: item.status,
        title: (
          <Badge
            status={item.responsible === "undefined" ? "processing" : "success"}
            text={`${item.area} [${
              item.responsible !== "undefined" ? item.responsible : "..."
            }]`}
          />
        ),
        subTitle: translate[item.taskName],
        description:
          item.status === "finish" ? (
            "Terminado en: " + item.totalTime
          ) : (
            <TimeCounter startDate={item.startDate} />
          ),
      };
    });
    setCurrentSteps(currentSteps);
  }, [currentPage]);

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
              {currentData.isFinished
                ? "Finalizado en"
                : "En proceso desde hace"}
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              <TimeCounter
                startDate={currentData.createdAt}
                endDate={
                  currentData.isFinished ? currentData.modifyedAt : Date.now()
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
            <Text>{currentData.initiator.toUpperCase()} solicita</Text>
            <Text strong style={{ fontSize: "16px" }}>
              {`${currentData.placeName} (${currentData.places})`}
            </Text>
          </Flex>
        </Flex>
        <Flex align="center">
          <Typography.Text>
            Procesos en {currentData.requestArea}
          </Typography.Text>
          <Pagination
            total={processLines.length * 10}
            onChange={(page) => setCurrentPage(page)}
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
          <Steps
            size="small"
            direction="vertical"
            current={1}
            items={currentSteps}
          />
        </Card>
      </Flex>
    )
  );
}
