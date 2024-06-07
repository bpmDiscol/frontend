import React from "react";
import { Badge, Descriptions, Divider, Flex } from "antd";
import { pesos } from "../../../misc/pesos";

export default function PositionGereralities({
  requestEmployee,
  requestEmployeeData,
}) {
  function getMotiveString(motives) {
    if (motives.isEmployeeExpanding) return "Aumento de personal";
    if (motives.isEmployeeInhability) return "Incapacidad de empleado";
    if (motives.isLicence) return "Licencia";
    if (motives.isNewCharge) return "Nuevo cargo";
    if (motives.isNewProject) return "Nuevo proyecto";
    if (motives.isReplacement) return "Reemplazo de personal";
    return "ERROR: motivo no encontrado";
  }
  function getContractTypeString(motives) {
    if (motives.isContractedLabor) return "Obra/Labor";
    if (motives.isUndefined) return "Termino indefinido";
    if (motives.isFixedTerm) return "Termino fijo";
    if (motives.isLearning) return "Aprendizaje";
    return "ERROR: Tipo no encontrado";
  }

  function getWorkingDayString(motives) {
    if (motives.isFullTime) return "Tiempo completo";
    if (motives.isPartTime) return "Medio tiempo";
    if (motives.isDayTime) return "Por dias";
    if (motives.isRemote) return "Remoto"
    return "ERROR: Jornada no encontrado";
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
      children: getMotiveString(requestEmployeeData.motive),
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
      children: getContractTypeString(requestEmployeeData.contractType),
    },
    {
      key: "2",
      label: "Jornada laboral",
      children: getWorkingDayString(requestEmployeeData.workingDay),
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
      children: `${requestEmployeeData?.duration.cuantity} ${requestEmployeeData?.duration.timePart}`,
    },

    {
      key: "6",
      label: "Bono",
      children: (
        <Badge
          status={requestEmployee.isBonus ? "success" : "error"}
          text={
            requestEmployee.isBonus
              ? ` Cada ${requestEmployeeData.bonusesFrecuency.cuantity} ${requestEmployeeData.bonusesFrecuency.timePart}`
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
