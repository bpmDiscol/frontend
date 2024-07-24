import React from "react";
import { Col, Descriptions, Flex, Row, Table, Tag } from "antd";
import Title from "antd/es/typography/Title";
import capitalize from "../../misc/capitalize";

const { Column } = Table;

export default function CandidateData({ data }) {
  function isGradeBelowMin(grade, minGrade) {
    const gradeOrder = ["D", "C", "B", "A"];
    return gradeOrder.indexOf(grade) < gradeOrder.indexOf(minGrade);
  }
  function mediaStrings(arrayValues) {
    let acumulador = 0;
    arrayValues.forEach((value) => (acumulador += parseInt(value)));
    return acumulador / arrayValues.length;
  }

  const intro = [
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
          <Tag color="warning">Familiar: {data.kinName || "No descrito"}</Tag>
          <Tag color="warning">Parentezco: {data.kinship || "No descrito"}</Tag>
        </Flex>
      ),
      span: 3,
    },
    {
      key: "4",
      label: "Información personal/familiar",
      children: (
        <div dangerouslySetInnerHTML={{ __html: data.personalAnnotation }} />
      ),
      span: 3,
    },
    {
      key: "5",
      label: "Nivel académico",
      children: capitalize(data?.academicLevel||""),
      span: 3,
    },
    {
      key: "6",
      label: "Titulo obtenido",
      children: capitalize(data?.grade||""),
      span: 3,
    },
    {
      key: "7",
      label: "Estudios complementarios",
      children: (
        <>
          {data.study?.map((study, index) => (
            <Tag key={index}>{capitalize(study)}</Tag>
          ))}
        </>
      ),
      span: 3,
    },
    {
      key: "8",
      label: "Sistemas/Software que conoce",
      children: (
        <>
          {data.systemKnown?.map((systemKnown, index) => (
            <Tag key={index}>{capitalize(systemKnown)}</Tag>
          ))}
        </>
      ),
      span: 3,
    },
    {
      key: "9",
      label: "Ropas",
      children: (
        <Flex vertical gap={5}>
          <Tag>Pantalones: {data.sizePants}</Tag>
          <Tag>Camisa: {data.sizeShirt}</Tag>
          <Tag>Zapatos: {data.sizeShoes}</Tag>
        </Flex>
      ),
      span: 3,
    },
  ];

  const movilidad = [
    {
      key: "1",
      label: "Cuenta con Moto/Vehiculo",
      children: (
        <Tag color={data.isVehicle ? "success" : ""}>
          {data.isVehicle ? "Si" : "No"}
        </Tag>
      ),
      span: 3,
    },
    {
      key: "2",
      label: "Licencia vigente",
      children: (
        <Tag color={data.isValidLicence ? "success" : ""}>
          {data.isValidLicence ? "Si" : "No"}
        </Tag>
      ),
      span: 3,
    },
    {
      key: "3",
      label: "Documentos al día",
      children: (
        <Tag color={data.isValidDocuments ? "success" : ""}>
          {data.isValidDocuments ? "Si" : "No"}
        </Tag>
      ),
      span: 3,
    },
    {
      key: "4",
      label: "Placa del vehículo",
      children: <Tag>{data.vechiclePlate || "No cuenta"}</Tag>,
    },
    {
      key: "5",
      label: "Propietario",
      children: <Tag>{data.vehicle_owner_name || "No cuenta"}</Tag>,
    },
    {
      key: "6",
      label: "Cédula",
      children: <Tag>{data.vehicle_owner_id || "No cuenta"}</Tag>,
    },
    {
      key: "7",
      label: "Revisión",
      children: (
        <Flex vertical gap={5}>
          <Tag color={data.isLicence ? "success" : "error"}>
            Licencia: {data.isLicence ? "Si" : "No"}
          </Tag>
          <Tag color={data.isSOAT ? "success" : "error"}>
            SOAT: {data.isSOAT ? "Si" : "No"}
          </Tag>
          <Tag color={data.isTecnomecanica ? "success" : "error"}>
            Tecnomecánica: {data.isTecnomecanica ? "Si" : "No"}
          </Tag>
        </Flex>
      ),
      span: 3,
    },
  ];

  const competencias = [
    {
      key: "1",
      label: "Evaluación de competencias",
      children: (
        <Flex vertical gap={5}>
          <Tag
            color={
              isGradeBelowMin(data.isEvaluationSensibility, "A")
                ? "error"
                : "success"
            }
          >
            Sensibilidad a lineamientos: {data.isEvaluationSensibility}
          </Tag>
          <Tag
            color={
              isGradeBelowMin(data.isEvaluationFocus, "B") ? "error" : "success"
            }
          >
            Enfoque a resultados: {data.isEvaluationFocus}
          </Tag>
          <Tag
            color={
              isGradeBelowMin(data.isEvaluationControl, "B")
                ? "error"
                : "success"
            }
          >
            Control de actividades: {data.isEvaluationControl}
          </Tag>
          <Tag
            color={
              isGradeBelowMin(data.isEvaluationOrientation, "A")
                ? "error"
                : "success"
            }
          >
            Orientación al servicio: {data.isEvaluationOrientation}
          </Tag>
          <Tag
            color={
              isGradeBelowMin(data.isEvaluationLearning, "A")
                ? "error"
                : "success"
            }
          >
            Aprendizaje: {data.isEvaluationLearning}
          </Tag>
        </Flex>
      ),
      span: 3,
    },
    {
      key: "2",
      label: "Nivel de ajuste al perfil",
      children: (
        <Flex vertical gap={5}>
          <Tag>Evaluación académica: {data.requiredAcademic}</Tag>
          <Tag>Evaluación experiencia: {data.requiredExperience}</Tag>
          <Tag>Evaluación competencias: {data.requiredCompetences}</Tag>
          <Tag>
            Promedio competencias:
            {mediaStrings([
              data.requiredAcademic,
              data.requiredExperience,
              data.requiredCompetences,
            ])}
          </Tag>
        </Flex>
      ),
      span: 3,
    },
  ];
  const evaluaciones_lider = [
    {
      key: "1",
      label: "Conocimientos técnicos",
      children: (
        <div dangerouslySetInnerHTML={{ __html: data.tecnicalknowledge }} />
      ),
      span: 3,
    },
    {
      key: "2",
      label: "Adaptación y aprendizaje frente al cargo",
      children: (
        <div dangerouslySetInnerHTML={{ __html: data.learningAdaptation }} />
      ),
      span: 3,
    },
    {
      key: "3",
      label: "Observaciones de evaluación técnica",
      children: (
        <div dangerouslySetInnerHTML={{ __html: data.tecnicalEvaluation }} />
      ),
      span: 3,
    },
  ];

  return (
    <Flex vertical gap={16}>
      <Row gutter={16}>
        <Col span={12}>
          <Descriptions bordered layout="vertical" size="small" items={intro} />
        </Col>
        <Col span={12}>
          <Descriptions
            bordered
            layout="vertical"
            size="small"
            items={movilidad}
          />
          <Descriptions
            bordered
            layout="vertical"
            size="small"
            items={competencias}
          />
        </Col>
      </Row>
      <Table
        showSorterTooltip={false}
        dataSource={data.laboralExperience}
        bordered
        size="small"
        pagination={false}
        scroll={{
          y: 200,
        }}
        rowKey={(record) => record.companyName}
        title={() => "Experiencia laboral"}
      >
        <Column title="Empresa" dataIndex={"companyName"} width={100} />
        <Column title="Cargo" dataIndex={"laboredPosition"} width={100} />
        <Column
          title="Tiempo laborado"
          dataIndex={"companyTime"}
          width={100}
          render={(value) => `${value.cuantity} ${value.timePart}(s)`}
        />
        <Column
          title="Motivo de retiro"
          dataIndex={"dismissMotive"}
          width={100}
        />
      </Table>
      <Descriptions
        title={"Evaluación del lider"}
        bordered
        layout="vertical"
        size="small"
        items={evaluaciones_lider}
      />
      <Flex vertical>
        <Title level={3}>Concepto final</Title>
        <div dangerouslySetInnerHTML={{ __html: data.finalConcept }} />
      </Flex>
    </Flex>
  );
}
