import React from "react";
import Chart from "react-apexcharts";
import monthNames from "./monthNames.json";
import ProcessTimes from "./tiempoDeProcesos";
import { Card, Flex, Select, Spin } from "antd";
import Transition from "../transition";

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
  const options = {
    xaxis: {
      categories: monthNames,
    },
    chart: {
      id: "mediaTimes",
      height: 350,
      type: "bar",
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
    },
    dataLabels: {
      enabled: true,
    },
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Tiempo medio de procesos",
      align: "left",
    },
    markers: {
      size: 1,
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return `${val} ${timeOperator.label}`;
        },
      },
    },
  };

  function fillEmptySpaces(array) {
    const newArray = [];
    for (i = 0; i < array.length; i++) {
      newArray.push(array[i] || 0);
    }
    return newArray;
  }

  function getTotalElapsedTime(year, chartData) {
    let finisheds = [];
    let unfinisheds = [];

    Object.keys(chartData[year]).forEach((month) => {
      let monthTime = 0;
      let monthcount = 0;
      let monthUnfinishedTime = 0;
      let monthUnfinishedCount = 0;

      const areas = Object.keys(chartData[year][month]);
      const currentMonthData = chartData[year][month];
      areas.forEach((area) => {
        monthTime += currentMonthData[area].elapsedFinishedTime;
        monthcount += currentMonthData[area].count;
        monthUnfinishedTime += currentMonthData[area].elapsedNonFinishedTime;
        monthUnfinishedCount += currentMonthData[area].unfinishedCount;
      });

      const monthMedia = monthTime / monthcount || 0;
      const unfinishedsMedia = monthUnfinishedTime / monthUnfinishedCount;
      finisheds[monthNames.indexOf(month)] = (
        monthMedia / timeOperator.value
      ).toFixed(2);
      unfinisheds[monthNames.indexOf(month)] = (
        unfinishedsMedia / timeOperator.value
      ).toFixed(2);
    });
    return {
      finisheds,
      unfinisheds,
    };
  }

  const timeOptions = [
    { value: 60, label: "Horas" },
    { value: 3600, label: "Días" },
  ];

  React.useEffect(() => {
    const procesed = ProcessTimes(requestProcess);
    setProcesedTimes(procesed);
    setProcessMedia(getTotalElapsedTime(yearToView, procesed));
  }, [timeOperator]);

  React.useEffect(() => {
    if (
      procesedTimes &&
      monthToView &&
      Object.keys(procesedTimes[yearToView]).includes(monthToView)
    ) {
      const areasTimes = {
        areas: [],
        finishedMedias: [],
        unfinishedMedias: [],
        finishedCosts: [],
        unfinishedCosts: [],
      };
      Object.keys(procesedTimes[yearToView][monthToView]).forEach((area) => {
        const currentArea = procesedTimes[yearToView]["Julio"][area];
        areasTimes.areas.push(area);
        areasTimes.finishedMedias.push(
          currentArea.elapsedFinishedTime /
            currentArea.count /
            timeOperator.value || 0
        );
        areasTimes.unfinishedMedias.push(
          currentArea.elapsedNonFinishedTime /
            currentArea.unfinishedCount /
            timeOperator.value || 0
        );
        areasTimes.finishedCosts.push(currentArea.cost);
        areasTimes.unfinishedCosts.push(currentArea.unfinishedCost);
      });
      setAreasTimes(areasTimes);
    } else setAreasTimes();
  }, [procesedTimes, yearToView, monthToView]);
  console.log("🚀 ~ React.useEffect ~ areasTimes:", areasTimes);
  console.log("🚀 ~ React.useEffect ~ monthToView:", monthToView);

  return (
    <Card bordered>
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

        {processMedia && (
          <Chart
            options={options}
            series={[
              {
                name: "Terminadas",
                data: fillEmptySpaces(processMedia.finisheds),
              },
              {
                name: "En proceso",
                data: fillEmptySpaces(processMedia.unfinisheds),
              },
            ]}
            width="400px"
          />
        )}
        {!processMedia && <Spin style={{ width: "500px" }} />}

        <Transition effect={areasTimes ? "zoom-in" : "hide"}>
          <Chart
            type="bar"
            options={{
              xaxis: {
                categories: areasTimes ? areasTimes.areas : [""],
              },
              chart: {
                id: "areaTimes",
                height: 350,
                type: "bar",
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  dataLabels: {
                    position: "top",
                  },
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
              title: {
                text: `Detalles del mes de ${monthToView}`,
                align: "left",
              },
              tooltip: {
                shared: false,
                y: {
                  formatter: function (val) {
                    return `${val} ${timeOperator.label}`;
                  },
                },
              },
            }}
            series={[
              {
                name: "Terminadas",
                data: areasTimes
                  ? fillEmptySpaces(areasTimes.finishedMedias)
                  : [""],
              },
              {
                name: "En proceso",
                data: areasTimes
                  ? fillEmptySpaces(areasTimes.unfinishedMedias)
                  : [""],
              },
            ]}
            width="400px"
          />
        </Transition>
      </Flex>
    </Card>
  );
}
