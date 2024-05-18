import React from "react";
import ItemBox from "../../../components/itemBox";
import { Descriptions, Result } from "antd";
import { pesos } from "../../../misc/pesos";

export default function PositionVehicle({
  requestEmployee,
  requestEmployeeData,
}) {
  const vehicleStats = [
    {
      key: "1",
      label: "Tipo de vehículo",
      children: requestEmployee.vehicleType,
      span: 2,
    },
    {
      key: "2",
      label: "Tipo de licencia",
      children: requestEmployee.licenceType,
    },
    {
      key: "3",
      label: "Valor de rodamiento",
      children: pesos.format(requestEmployee.bearingValue),
      span: 2,
    },
  ];
  return requestEmployee.requestEmployeeisVehicle ? (
    <Descriptions items={vehicleStats} bordered />
  ) : (
    <Result title="No se requiere vehículo" status={"info"} />
  );
}
