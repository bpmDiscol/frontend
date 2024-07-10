import React from "react";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";

import calcularTiempoPromedioPorActividad from "./tiempoMedioPorActividad";
import ProcessTimes from "./tiempoDeProcesos";
import ProcessTimesChart from "./processTimesChart";
import { Flex } from "antd";
import ProcessCostsChart from "./processCostsTimes";
import ProcessRequests from "./processRequests";

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

  //   React.useEffect(() => {
  //     if (approvations && requestProcess) {
  //       console.table(
  //         calcularTiempoPromedioPorActividad(approvations, requestProcess)
  //       );
  //       console.table(ProcessTimes(requestProcess));
  //     }
  //   }, [approvations]);

  return (
    <Flex vertical gap={20}>
      {requestProcess && requestProcess && (
        <ProcessRequests
          requestProcess={requestProcess}
          approvations={approvations}
        />
      )}
      {requestProcess && <ProcessCostsChart requestProcess={requestProcess} />}
      {requestProcess && <ProcessTimesChart requestProcess={requestProcess} />}
    </Flex>
  );
}
