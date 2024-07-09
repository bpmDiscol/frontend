import React from "react";
import Chart from "react-apexcharts";
import monthNames from "./monthNames.json";
import ProcessTimes from "./tiempoDeProcesos";
import { Card, Select, Spin } from "antd";

export default function AreasTimesChart({ requestProcess }) {
  const [processMedia, setProcessMedia] = React.useState();
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
      type: "area",
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

  React.useEffect(() => {
    setProcessMedia(getTotalElapsedTime("2024", ProcessTimes(requestProcess)));
  }, [timeOperator]);

  const timeOptions = [
    { value: 60, label: "Horas" },
    { value: 3600, label: "Días" },
  ];

  return (
    <Card bordered>
      <Select
        options={timeOptions}
        defaultValue={60}
        onChange={(_, option) => {
          setTimeOperator(option);
        }}
      />

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
          type="line"
          width="500"
        />
      )}
      {!processMedia && <Spin style={{ width: "500px" }} />}
    </Card>
  );
}
