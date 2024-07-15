import React from "react";
import Chart from "react-apexcharts";
import monthNames from "./monthNames.json";
import ProcessTimes from "./tiempoDeProcesos";
import { Card, Flex, Select, Spin } from "antd";
import "../transition/transition.css";
import { getAreasTimes } from "./getAreasTimes";
import { getTotalElapsedTime } from "./getTotalElapsedTimes";
import { fillEmptySpaces } from "./fillEmptySpaces";
import { getCosts } from "./getCosts";

export default function ProcessCostsChart({ requestProcess }) {
  const [processMedia, setProcessMedia] = React.useState();
  const [procesedTimes, setProcesedTimes] = React.useState();
  const [processedCosts, setProcessedCosts] = React.useState();
  const [areasTimes, setAreasTimes] = React.useState();
  const [yearToView, setYearToView] = React.useState("2024");
  const [monthToView, setMonthToview] = React.useState();
  const [timeOperator, setTimeOperator] = React.useState({
    value: 60,
    label: "Horas",
  });
  const mediaTimesOptions = {
    xaxis: {
      categories: monthNames,
    },
    yaxis: {
      title: {
        text: "Millones",
      },
      labels: {
        formatter: function (val) {
          return val;
        },
      },
    },

    chart: {
      id: "mediaTimes",
      height: 350,
      type: "line",
      stacked: true,
      events: {
        click: function (e, chart, config) {
          setMonthToview(monthNames[Math.max(config.dataPointIndex, 0)]);
        },
      },
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      toolbar: { show: false },
    },
    stroke: {
      curve: "stepline",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${parseFloat(val).toFixed(1)} M`;
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        barHeight: "70%",
        dataLabels: {
          enabled: true,
          total: {
            enabled: true,
            style: {
              fontWeight: 500,
            },
            formatter: function (val) {
              return `${parseFloat(val).toFixed(1)} M`;
            },
          },
        },
      },
    },
    title: {
      text: "Costos de procesos",
      align: "left",
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return `${parseFloat(val).toFixed(2)} Millones`;
        },
      },
    },
  };
  const mediaAreasOptions = {
    xaxis: {
      categories: areasTimes ? areasTimes.areas : [""],
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val;
        },
      },
    },
    chart: {
      id: "areaTimes",
      type: "bar",
      height: 500,
      stacked: true,
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        barHeight: "70%",
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontWeight: 500,
            },
            formatter: function (val) {
              return val.toFixed(2) + "M";
            },
          },
        },
      },
    },
    legend: { show: false },
    title: {
      text: `Costo por area - ${monthToView}`,
      align: "left",
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return `${val} Millones`;
        },
      },
    },
  };

  React.useEffect(() => {
    const procesed = ProcessTimes(requestProcess);
    setProcesedTimes(procesed);
    setProcessMedia(
      getTotalElapsedTime(yearToView, procesed, timeOperator.value)
    );
  }, [timeOperator]);

  React.useEffect(() => {
    setAreasTimes(
      getAreasTimes(procesedTimes, yearToView, monthToView, timeOperator.value)
    );
  }, [procesedTimes, yearToView, monthToView]);

  React.useEffect(() => {
    setProcessedCosts(getCosts(procesedTimes, yearToView));
  }, [procesedTimes, yearToView]);
  return (
    <Card bordered style={{ border: "1px solid" }}>
      {!processedCosts && <Spin style={{ width: "500px" }} />}
      <Flex style={{ height: "55dvh" }}>
      <Flex vertical>
        <Flex>
          selector
        </Flex>

      </Flex>
      </Flex>

      <Flex gap={"20px"}>
        {procesedTimes && (
          <Select
            options={Object.keys(procesedTimes).map((year) => {
              return {
                label: year,
                value: year,
              };
            })}
            onChange={(value) => setYearToView(value)}
            defaultActiveFirstOption={true}
            defaultValue={"2024"}
          />
        )}
      </Flex>
      <Flex>
        <Flex gap={20} style={{ width: "40dvw", height: "40dvh" }}>
          {processedCosts && (
            <Chart
              type="area"
              options={mediaTimesOptions}
              series={[
                {
                  name: "Terminadas",
                  // data: fillEmptySpaces([2, 4, 5, 6, 1, 3]),
                  data: fillEmptySpaces(processedCosts.monthlyCost),
                },
                {
                  name: "En proceso",
                  // data: fillEmptySpaces([0,,4,5,3]),
                  data: fillEmptySpaces(processedCosts.unfinishedMonthlyCost),
                },
              ]}
              style={{ width: "40dvw" }}
              width={400}
              height={300}
            />
          )}
          {!processedCosts && <Spin style={{ width: "500px" }} />}
          {areasTimes && (
            <Card className={"showme"} style={{ border: "1px solid" }}>
              <Chart
                type="bar"
                options={mediaAreasOptions}
                series={[
                  {
                    name: "Terminadas",
                    data: areasTimes
                      ? // ? fillEmptySpaces([1.332, 4.345])
                        fillEmptySpaces(areasTimes.finishedCosts)
                      : [""],
                  },
                  {
                    name: "En espera",
                    data: areasTimes
                      ? fillEmptySpaces(areasTimes.unfinishedCosts)
                      : [""],
                  },
                ]}
                style={{ width: "30dvw" }}
              />
            </Card>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}
