import React from "react";
import { Meteor } from "meteor/meteor";
import { fontList } from "../../misc/fontList.js";

import Chart from "react-apexcharts";
import { Card, Flex } from "antd";

export default function Founded() {
  const fontArray = fontList.map((font) => font.label);
  const [counts, setCounts] = React.useState();
  React.useEffect(() => {
    const promisedCounts = fontArray.map((font) =>
      Meteor.callAsync("count_employee_font", font).catch((e) => e)
    );
    Promise.all(promisedCounts)
      .then((counts) => setCounts(counts))
      .catch((e) => console.log(e));
  }, []);

  const foundedOptions = {
    labels: fontArray,

    chart: {
      id: "foundeds",
      type: "donut",

      dropShadow: {
        enabled: true,
        color: "#000",
        top: 0,
        left: 17,
        blur: 10,
        opacity: 0.2,
      },
      toolbar: { show: false },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },

    title: {
      text: "¿En dónde se encuentran los candidatos?",
      align: "left",
    },
    tooltip: {
      shared: false,
    },
  };

  return (
    <Card bordered style={{ border: "1px solid" }}>
      <Flex justify="center" align="center" style={{ flex: 1 }}>
        {counts && (
          <Flex style={{ width: "40dvw", height: "45dvh" }}>
            <Chart
              type="donut"
              options={foundedOptions}
              series={counts}
              style={{ flex: 1 }}
              height={300}
            />
          </Flex>
        )}
      </Flex>
    </Card>
  );
}
