import React from "react";
import Chart from "react-apexcharts";
import moment from "moment";
import { Card, Col, Empty, Flex, Row, Select, Spin, Statistic } from "antd";

import getApprovationsTimes from "./getTimes";
import getMonthData from "./getMonthData";

import monthNames from "./monthNames.json";
import "../transition/transition.css";
import getEffectivity from "./getEffectivity";

export default function ProcessTimesChart({ requestProcess, approvations }) {
  const [yearToView, setYearToView] = React.useState(moment().year());
  const [monthToView, setMonthToview] = React.useState(moment().month());

  const [approvationTimes, setApprovationsTimes] = React.useState();
  const [processTimes, setProcessTimes] = React.useState();
  const [years, setYears] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [ANS, setANS] = React.useState({ minHHrr: 0, maxHHrr: 0 });

  const areaColors = processTimes?.areaValues.map((value) =>
    value >= ANS.minHHrr
      ? value >= ANS.maxHHrr
        ? "#ff6868"
        : "#ffc526"
      : "#30db63"
  );
  const taskColors = processTimes?.taskValues.map((value) =>
    value >= ANS.minHHrr
      ? value >= ANS.maxHHrr
        ? "#ff6868"
        : "#ffc526"
      : "#30db63"
  );
  const mediaAreasOptions = (type) => ({
    xaxis: {
      categories: processTimes ? processTimes[type] : [""],
      title: {
        text: "Dias",
      },
    },

    colors: ["#30db63"],
    chart: {
      id: "areaTimes",
      type: "bar",
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
      },
    },
    legend: { show: false },
    title: {
      text: `Tiempo medio por ${type == "areaTitles" ? "area" : "tarea"}`,
      align: "left",
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return `Tiempo medio >> ${val} días`;
        },
      },
    },
  });

  function getApprovations(ANS_, next) {
    if (!ANS_) ANS_ = ANS;
    getApprovationsTimes(requestProcess, approvations, ANS_.list).then(
      (approvationTimes) => {
        setApprovationsTimes(approvationTimes);
        setLoading(false);
        if (next) next(approvationTimes);
      }
    );
  }

  function getANS(approvationTimes) {
    let processIds = [];
    try {
      processIds =
        approvationTimes[yearToView][monthNames[monthToView]].processIds;
    } catch {}

    Meteor.call("get_ANS", approvationTimes ? processIds : [], (err, ANS) => {
      if (!err) {
        setANS(ANS[0] || { minHHrr: 0, maxHHrr: 0 });
        getApprovations(ANS[0]);
      }
    });
  }

  React.useEffect(() => {
    getApprovations(null, getANS);
  }, []);

  React.useEffect(() => {
    if (approvationTimes) {
      setYears(Object.keys(approvationTimes));
      const monthData = getMonthData(approvationTimes, yearToView, monthToView);
      setProcessTimes(monthData);
    }
  }, [approvationTimes, yearToView, monthToView]);

  React.useEffect(() => {
    getANS(approvationTimes);
  }, [yearToView, monthToView]);

  return (
    <Card bordered style={{ border: "1px solid" }}>
      <Flex vertical gap={32}>
        <Flex gap={20}>
          {years && (
            <Select
              options={years.map((year) => {
                return {
                  label: year,
                  value: year,
                };
              })}
              onChange={(value) => setYearToView(value)}
              defaultValue={moment().year()}
            />
          )}
          <Select
            options={monthNames.map((month, index) => {
              return {
                label: month,
                value: index,
              };
            })}
            onChange={(value) => setMonthToview(value)}
            defaultValue={moment().month()}
            style={{ width: "10rem" }}
          />
        </Flex>
        {approvationTimes && (
          <Flex gap={32}>
            <Card
              style={{
                boxShadow: "10px 10px 10px gray",
                border: "1px solid black",
              }}
            >
              <Statistic
                title="Efectividad Gestion Humana"
                value={getEffectivity(
                  approvationTimes[yearToView][monthNames[monthToView]]
                    ?.hhrrEfectivity
                )}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                // prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
            <Card
              style={{
                boxShadow: "10px 10px 10px gray",
                border: "1px solid black",
              }}
            >
              <Statistic
                title="Efectividad Lideres"
                value={getEffectivity(
                  approvationTimes[yearToView][monthNames[monthToView]]
                    ?.leaderEfectivity
                )}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                // prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Flex>
        )}

        <Row>
          <Col span={12}>
            <Spin spinning={loading}>
              <Flex align="center" justify="center" style={{ height: "75dvh" }}>
                {processTimes && (
                  <Chart
                    key={`${yearToView}-${monthToView}`}
                    type="bar"
                    options={mediaAreasOptions("areaTitles")}
                    series={[
                      {
                        name: "Area",
                        data: processTimes.areaValues,
                      },
                    ]}
                    style={{ flex: 1 }}
                    height={"100%"}
                  />
                )}
                {!processTimes && (
                  <Empty
                    description={
                      loading
                        ? "Recolectando información..."
                        : "Este mes no tiene datos"
                    }
                  />
                )}
              </Flex>
            </Spin>
          </Col>
          <Col span={12}>
            <Spin spinning={loading}>
              <Flex align="center" justify="center" style={{ height: "75dvh" }}>
                {processTimes && (
                  <Chart
                    key={`${yearToView}-${monthToView}`}
                    type="bar"
                    options={mediaAreasOptions("taskTitles")}
                    series={[
                      {
                        name: "Tarea",
                        data: processTimes.taskValues,
                      },
                    ]}
                    style={{ flex: 1 }}
                    height={"100%"}
                  />
                )}
                {!processTimes && (
                  <Empty
                    description={
                      loading
                        ? "Recolectando información..."
                        : "Este mes no tiene datos"
                    }
                  />
                )}
              </Flex>
            </Spin>
          </Col>
        </Row>
      </Flex>
    </Card>
  );
}
