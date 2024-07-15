import React from "react";
import Chart from "react-apexcharts";
import monthNames from "./monthNames.json";
import ProcessTimes from "./tiempoDeProcesos";
import { Card, Flex, Select, Spin } from "antd";
import "../transition/transition.css";
import { getAreasTimes } from "./getAreasTimes";
import { getTotalElapsedTime } from "./getTotalElapsedTimes";
import { fillEmptySpaces } from "./fillEmptySpaces";
import { sumaArrayValues } from "./sumaArrayValues";

export default function ProcessTimesChart({ requestProcess }) {
  const [processMedia, setProcessMedia] = React.useState();
  const [procesedTimes, setProcesedTimes] = React.useState();
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
        text: timeOperator.label,
      },
    },

    chart: {
      id: "mediaTimes",
      height: 350,
      type: "line",
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
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Tiempo medio de todos los procesos",
      align: "left",
    },
    markers: {
      size: 1,
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return `${val.toFixed(2)} ${timeOperator.label}`;
        },
      },
    },
  };
  const mediaAreasOptions = {
    xaxis: {
      categories: areasTimes ? areasTimes.areas : [""],
      title: {
        text: timeOperator.label,
      },
    },
    yaxis: {
      title: {
        text: "Areas",
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
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    legend: { show: false },
    title: {
      text: `Tiempo medio por area - ${monthToView}`,
      align: "left",
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return `${val.toFixed(2)} ${timeOperator.label}`;
        },
      },
    },
  };

  const timeOptions = [
    { value: 1, label: "Minutos" },
    { value: 60, label: "Horas" },
    { value: 3600, label: "Días" },
  ];

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

  return (
    <Flex gap={10}>
      <Card bordered style={{ border: "1px solid" }}>
        <Flex gap={"20px"}>
          <Select
            options={timeOptions}
            defaultValue={60}
            onChange={(_, option) => {
              setTimeOperator(option);
            }}
          />

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
            {processMedia && (
              <Chart
                type="line"
                options={mediaTimesOptions}
                series={[
                  {
                    name: "Terminadas",
                    data: fillEmptySpaces(processMedia.finisheds),
                  },
                  {
                    name: "En espera",
                    data: fillEmptySpaces(processMedia.unfinisheds),
                  },
                  {
                    name: "Total transcurrido",
                    data: sumaArrayValues(
                      fillEmptySpaces(processMedia.finisheds),
                      fillEmptySpaces(processMedia.unfinisheds)
                    ),
                  },
                ]}
                style={{ width: "40dvw" }}
                width={400}
                height={300}
              />
            )}
            {!processMedia && <Spin style={{ width: "500px" }} />}
            {areasTimes && (
              <Card className={"showme"} style={{ border: "1px solid" }}>
                <Chart
                  type="bar"
                  options={mediaAreasOptions}
                  series={[
                    {
                      name: "Terminadas",
                      data: areasTimes
                        ? fillEmptySpaces(areasTimes.finishedMedias)
                        : [""],
                    },
                    {
                      name: "En espera",
                      data: areasTimes
                        ? fillEmptySpaces(areasTimes.unfinishedMedias)
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
    </Flex>
  );
}
