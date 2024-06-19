import React from "react";
import { Badge, Descriptions, Divider, Flex } from "antd";
import { pesos } from "../../../misc/pesos";
import motives from "../../bpm/data/motives.json";
import contracts from "../../bpm/data/contractType.json";
import journals from "../../bpm/data/workingDay.json";

export default function PositionGereralities({ requestEmployee }) {
  function getValueString(selecter, select) {
    const obj = selecter.filter((item) => item.value == select)[0];
    return obj.label ?? "ERROR: item no encontrado";
  }

  const generalities = [
    {
      key: "1",
      label: "Puesto solicitado",
      children: requestEmployee.companyPosition,
      span: 2,
    },
    {
      key: "2",
      label: "Sede",
      children: requestEmployee.site,
    },
    {
      key: "3",
      label: "Area/proyecto",
      children: requestEmployee.area_proyect,
      span: 2,
    },
    {
      key: "4",
      label: "Lugar de trabajo",
      children: requestEmployee.workPlace,
    },
    {
      key: "5",
      label: "Motivo del requerimiento",
      children: getValueString(motives, requestEmployee.motive),
      span: 2,
    },
    {
      key: "6",
      label: "Cantidad de vacantes",
      children: requestEmployee.vacancies,
    },
  ];

  const contract = [
    {
      key: "1",
      label: "Tipo de contrato",
      children: getValueString(contracts, requestEmployee.contractType),
    },
    {
      key: "2",
      label: "Jornada laboral",
      children: getValueString(journals, requestEmployee.workingDayType),
    },
    {
      key: "3",
      label: "Dentro del manual de funciones",
      children: (
        <Badge
          status={requestEmployee.isHandbookFunction ? "success" : "error"}
          text={requestEmployee.isHandbookFunction ? "Si" : "No"}
        />
      ),
    },

    {
      key: "4",
      label: "Salario asignable",
      children: pesos.format(requestEmployee.salary),
    },
    {
      key: "5",
      label: "Duración",
      children: `${requestEmployee?.duration.cuantity} ${requestEmployee?.duration.timePart}`,
    },

    {
      key: "6",
      label: "Bono",
      children: (
        <Badge
          status={requestEmployee.isBonus ? "success" : "error"}
          text={
            requestEmployee.isBonus
              ? ` Cada ${requestEmployee.bonusesFrecuency.cuantity} ${requestEmployee.bonusesFrecuency.timePart}`
              : "No bono"
          }
        />
      ),
    },
  ];
  return (
    <Flex justify="center" vertical>
      <Descriptions items={generalities} bordered size="small" />
      <Divider />
      <Descriptions title="Contrato" items={contract} bordered size="small" />
    </Flex>
  );
}
