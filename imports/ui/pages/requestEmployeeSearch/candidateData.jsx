import React from "react";
import { Descriptions, Flex, Tag } from "antd";
import Title from "antd/es/typography/Title";

export default function CandidateData({ data }) {
  console.log("🚀 ~ CandidateData ~ data:", data);

  const bussines = [
    {
      key: "1",
      label: "¿Ha laborado antes en DISCOL?",
      children: (
        <Tag color={data.isPreviusEmployee ? "warning" : "success"}>
          {data.isPreviusEmployee ? "Si" : "No"}
        </Tag>
      ),
      span: 3,
    },
    {
      key: "2",
      label: "¿Motivo de retiro?",
      children: data.retirementMotive || (
        <Tag>{data.isPreviusEmployee ? "No introducido" : "No requerido"} </Tag>
      ),
      span: 3,
    },
    {
      key: "3",
      label: "¿Fecha de retiro?",
      children: data.retirementDate || (
        <Tag>{data.isPreviusEmployee ? "No introducido" : "No requerido"} </Tag>
      ),

      span: 3,
    },
  ];
  return (
    <Flex vertical>
      <Title level={3}>
        {data.name} {data.lastNames}
      </Title>
      <Descriptions bordered size="small" items={bussines} />;
    </Flex>
  );
}
