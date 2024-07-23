import React from "react";
import { Descriptions, Flex, List, Tag } from "antd";
import translate from "../../misc/translate.json";
import capitalize from "../../misc/capitalize";
import { pesos } from "../../misc/pesos";
import { CheckCircleTwoTone, HourglassTwoTone } from "@ant-design/icons";

export default function General({requestEmployee}) {
    const duration = `${requestEmployee.duration.cuantity} ${requestEmployee.duration.timePart}`;
  const observationTitles = ["Solicitante", "Director", "Gestion Humana"];
  const lastSteps = [
    "generate_induction",
    "activate_social_security",
    "gears_auth",
    "biometric_registry",
    "RUT",
    "bank_certificate",
    "base",
    "sign_contract",
  ];

  const base = [
    {
      key: "1",
      label: "Fecha de inicio",
      children: new Date(requestEmployee.createdAt).toUTCString(),
      span: 3,
    },

    {
      key: "2",
      label: "Cargo",
      children: capitalize(requestEmployee.companyPosition),
      span: 2,
    },
    {
      key: "3",
      label: "Sitio",
      children: capitalize(requestEmployee.workPlace),
    },
    {
      key: "4",
      label: "Tipo de contrato",
      children: translate[requestEmployee.contractType],
      span: 2,
    },
    {
      key: "5",
      label: "Duración",
      children: duration === "-1 mes" ? "N/A" : duration,
    },
    {
      key: "6",
      label: "Jornada",
      children: translate[requestEmployee.workingDayType],
      span: 2,
    },
    {
      key: "7",
      label: "Motivo",
      children: translate[requestEmployee.motive],
    },
    {
      key: "8",
      label: "Salario",
      children: requestEmployee.salary,
      span: 2,
    },
    {
      key: "9",
      label: "Bono",
      children: requestEmployee.isBonus
        ? `Cada ${requestEmployee.bonusesFrecuency.cuantity} ${requestEmployee.bonusesFrecuency.timePart}`
        : "Sin bono",
    },
  ];

  const bonus = [
    {
      key: "10",
      label: "¿Dentro del manual de funciones?",
      children: requestEmployee.isHandbookFunction ? "Si" : "No",
      span: 3,
    },
  ];

  const vehicle = [
    {
      key: "11",
      label: "Vehículo requerido",
      children: capitalize(requestEmployee.vehicleType)|| <Tag color="error">No requerido</Tag>,
      span: 2,
    },
    {
      key: "12",
      label: "Tipo de licencia",
      children: requestEmployee.licenceType|| <Tag color="error">No requerido</Tag>,
    },
    {
      key: "13",
      label: "Valor de rodamiento",
      children: pesos.format(requestEmployee.bearingValue)|| <Tag color="error">No requerido</Tag>,
      span: 2,
    },
  ];

  const requerimientos = [
    {
      key: "14",
      label: "Requerimientos",
      children: (
        <p dangerouslySetInnerHTML={{ __html: requestEmployee.requirements }} />
      ),
      span: 3,
    },
    {
      key: "15",
      label: "Observaciones",
      children: requestEmployee.observations.map((observation, index) => {
        return (
          <Flex key={index}>
            {observationTitles[index]}
            <p dangerouslySetInnerHTML={{ __html: observation }} />
          </Flex>
        );
      }),
      span: 3,
    },
    {
      key: "16",
      label: "Elementos necesarios",
      children: (
        <Flex vertical>
          {Object.keys(requestEmployee.gears).map((gear, index) => {
            return requestEmployee.gears[gear] ? (
              <Tag key={index}>{translate[gear]}</Tag>
            ) : null;
          })}
          {requestEmployee.gears.other.map((gear, index) => {
            return <Tag key={index}>{gear}</Tag>;
          })}
        </Flex>
      ),
      span: 2,
    },
  ];

  return (
    <Flex vertical gap={16}>
      <Descriptions bordered size="small" items={base} />
      <Descriptions bordered size="small" items={bonus} />
      {requestEmployee.isVehicle && (
        <Descriptions bordered size="small" items={vehicle} />
      )}
      <Descriptions bordered size="small" items={requerimientos} />
      <List
        dataSource={lastSteps}
        renderItem={(item) => (
          <List.Item key={item}>
            <List.Item.Meta
              title={translate[item]}
              avatar={
                requestEmployee[item] ? (
                  <CheckCircleTwoTone twoToneColor='#52c41a' style={{fontSize:18}}/>
                ) : (
                  <HourglassTwoTone spin />
                )
              }
            />
          </List.Item>
        )}
      />
    </Flex>
  );
}

