import React from "react";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";

import calcularTiempoPromedioPorActividad from "./tiempoMedioPorActividad";
import ProcessTimes from "./tiempoDeProcesos";
import ProcessTimesChart from "./processTimesChart";
import { Flex } from "antd";

export default function AdminDashboard() {
  const [requestProcess, setRequestProcess] = React.useState();
  const [approvations, setApprovations] = React.useState();

  React.useEffect(() => {
    Meteor.call("get_requestProcess", (err, requestProcessData) => {
      setRequestProcess(requestProcessData);

      if (!err) {
        Meteor.call(
          "get_approvations",
          requestProcessData,
          (_, approvationsData) => {
            setApprovations(approvationsData);
          }
        );
      }
    });
  }, []);

    // React.useEffect(() => {
    //   if (approvations && requestProcess) {
    //     console.table(
    //       calcularTiempoPromedioPorActividad(approvations, requestProcess)
    //     );
    //     console.table(ProcessTimes(requestProcess));
    //   }
    // }, [approvations]);

  return (
    <Flex vertical justify="center" align="center">
      {requestProcess && <ProcessTimesChart requestProcess={requestProcess} />}
    </Flex>
  );
}
