import React from "react";
import { Card, Flex, Result, Select, Spin } from "antd";
import Chart from "react-apexcharts";
import { fillEmptySpaces } from "./fillEmptySpaces";

import "./apex.css";

import {
  getContractsByDate,
  getContratationDates,
  getProcessLine,
} from "./contratations";
import StepsLines from "./steps";

export default function ProcessRequests({ requestProcess, approvations }) {
  const [dates, setDates] = React.useState();
  const [currentDate, setCurrentDate] = React.useState();
  const [contracts, setContracts] = React.useState();
  const [processLines, setProcessLines] = React.useState([]);
  React.useEffect(() => {
    const dates = getContratationDates(approvations, requestProcess).reverse();
    setDates(dates);
    setCurrentDate(dates[0]?.value);
  }, [approvations, requestProcess]);

  React.useEffect(() => {
    if (dates?.length) {
      const contracts_ = getContractsByDate(
        currentDate || dates[0].value,
        approvations,
        requestProcess
      );
      setContracts(contracts_);
    }
  }, [currentDate, dates, approvations, requestProcess]);

  function setArea(area) {
    if (!area) return;
    const processLines_ = getProcessLine(
      area,
      currentDate,
      approvations,
      requestProcess
    );
    setProcessLines(processLines_ || []);
  }

  const contractOptions = {
    xaxis: {
      categories: Object.keys(contracts || {}),
      labels: {
        style: {
          fontSize: "12px",
          cssClass: "selectableBar",
        },
      },
    },

    chart: {
      id: "mediaTimes",
      height: 500,
      type: "line",
      stacked: true,
      // stackType: "100%",
      events: {
        xAxisLabelClick: function (_, _, config) {
          if (config.labelIndex < 0) return;
          const area = config.globals.labels[config.labelIndex];

          setArea(area);
        },

        click: function (_, _, config) {
          if (config.dataPointIndex < 0) return;
          const area = config.globals.labels[config.dataPointIndex];
          setArea(area);
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
      toolbar: { show: true },
    },
    stroke: {
      curve: "stepline",
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        barHeight: "70%",
        horizontal: false,
        dataLabels: {
          enabled: true,
        },
      },
    },
    title: {
      text: "Contrataciones por area",
      align: "left",
    },
    tooltip: {
      shared: false,
      y: {},
    },
  };

  function separateContract(contracts) {
    let candidates = [];
    let finales = [];
    let places = [];
    const areas = Object.keys(contracts);
    areas.forEach((area) => {
      candidates.push(contracts[area].candidates[0]);
      finales.push(contracts[area].finales[0]);
      places.push(contracts[area].places[0]);
    });
    return {
      candidates,
      finales,
      places,
    };
  }

  return (
    <Card bordered style={{ border: "1px solid" }}>
      {!contracts && <Spin style={{ width: "500px" }} />}
      {contracts && (
        <Flex style={{ height: "55dvh" }}>
          <Flex vertical>
            <Flex>
              {dates?.length && (
                <Select
                  options={dates}
                  defaultValue={dates[0].value}
                  onChange={(value) => setCurrentDate(value)}
                />
              )}
            </Flex>
            <Flex style={{ width: "40dvw", height: "40dvh" }}>
              <Chart
                type="bar"
                options={contractOptions}
                series={[
                  {
                    name: "Candidatos",
                    data: fillEmptySpaces(
                      separateContract(contracts).candidates
                    ),
                  },
                  {
                    name: "Contratados",
                    data: fillEmptySpaces(separateContract(contracts).finales),
                  },
                  {
                    name: "Solicitados",
                    data: fillEmptySpaces(separateContract(contracts).places),
                  },
                ]}
                width={400}
                height={300}
              />
            </Flex>
          </Flex>
          <Flex style={{ flex: 1 }} justify="center">
            {processLines.length ? (
              <StepsLines processLines={processLines} />
            ) : (
              <Result
                status="500"
                title="Por favor selecciona un área"
                subTitle=""
              />
            )}
          </Flex>
        </Flex>
      )}
    </Card>
  );
}
