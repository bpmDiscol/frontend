import React from "react";
import { Descriptions, Flex, Tag } from "antd";
import Title from "antd/es/typography/Title";

export default function CandidateData({ data }) {
  console.log("🚀 ~ CandidateData ~ data:", data);

  const bussines = [
    {
      key: "1",
      label: data.isPreviusEmployee
        ? "Laboró antes en DISCOL"
        : "No ha laborado en DISCOL",
      children: data.isPreviusEmployee && (
        <Flex vertical gap={5}>
          <Tag color="warning">
            Motivo de retiro: {data.retirementMotive || "No descrito"}
          </Tag>
          <Tag color="warning">
            Fecha de retiro: {data.retirementDate || "No descrito"}
          </Tag>
        </Flex>
      ),
      span: 3,
    },
    {
      key: "2",
      label: data.isAboutBussiness
        ? "Laboró en empresas contratistas asociadas"
        : "No ha aborado en empresas contratistas asociadas",
      children: data.isAboutBussiness && (
        <Flex vertical gap={5}>
          <Tag color="warning">
            Empresa: {data.aboutBusinessName || "No descrito"}
          </Tag>
          <Tag color="warning">
            Motivo de retiro: {data.aboutBusinessMotive || "No descrito"}
          </Tag>
          <Tag color="warning">
            Jefe inmediato: {data.aboutBusinessBoss || "No descrito"}
          </Tag>
        </Flex>
      ),
      span: 3,
    },
    {
      key: "3",
      label: data.isAboutFamily
        ? "Tiene familiares en DISCOL"
        : "No tiene familiares en DISCOL",
      children: data.isAboutFamily && (
        <Flex vertical gap={5}>
          <Tag color="warning">
            Familiar: {data.kinName || "No descrito"}
          </Tag>
          <Tag color="warning">
            Parentezco: {data.kinship || "No descrito"}
          </Tag>
        </Flex>
      ),
      span: 3,
    },
  ];
  return (
    <Flex vertical>
      <Title level={3}>
        {data.name} {data.lastNames}
      </Title>
      <Descriptions bordered layout="vertical" size="small" items={bussines} />
    </Flex>
  );
}
