import React from "react";
import { Card, Flex, Pagination, Statistic, Steps, Typography } from "antd";
import TimeCounter from "../timeCounter";

const significa = {
  employee_request_adm: "Aprobación",
  employee_request_hr: "Aprobación",
  load_curricullum: "Cargar CV",
  interview: "Entrevitas",
  legal_background: "Antecedentes",
  curricullum_check: "Selección de candidatos",
  upload_cv_files: "Cargar documentos",
  healt_service_response: "Respuesta de Salud ocupacional",
  hse_approvation: "Aprobación",
  generate_induction: "Inducción",
  activate_social_security: "Seguridad social",
  gears_auth: "Autorización de equipos",
  biometric_registry: "Registro biométrico",
  RUT: "presentación de RUT",
  bank_certificate: "Certificado bancario",
  base: "Presentación base de nomina",
  sign_contract: "Firma de contrato",
};

export default function StepsLines({ processLines }) {
  //   const [currentData, setCurrentData] = React.useState();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentSteps, setCurrentSteps] = React.useState();
  const currentData = processLines[currentPage - 1];

  const { Text } = Typography;
  React.useEffect(() => {
    const currentSteps = currentData.steps.map((item) => {
      return {
        status: item.status,
        title: item.area,
        subTitle: significa[item.taskName],
        description:
          item.status === "finish" ? (
            "Terminado en: " + item.totalTime
          ) : (
            <TimeCounter startDate={item.startDate} />
          ),
      };
    });
    setCurrentSteps(currentSteps);
  }, [currentPage]);

  return (
    processLines && (
      <Flex vertical gap={10} className="showme">
        <Flex gap={10}>
          <Flex
            justify="center"
            align="center"
            vertical
            style={{
              borderRadius: "10px",
              border: "1px solid",
              padding: "5px 15px",
            }}
          >
            <Text>
              {currentData.isFinished
                ? "Finalizado en"
                : "En proceso desde hace"}
            </Text>
            <Text strong style={{ fontSize: "16px" }}>
              <TimeCounter
                startDate={currentData.createdAt}
                endDate={
                  currentData.isFinished ? currentData.modifyedAt : Date.now()
                }
              />
            </Text>
          </Flex>
          <Flex
            justify="center"
            align="center"
            vertical
            style={{
              borderRadius: "10px",
              border: "1px solid",
              padding: "5px 15px",
            }}
          >
            <Text>Vacantes solicitadas</Text>
            <Text strong style={{ fontSize: "16px" }}>
              {currentData.places}
            </Text>
          </Flex>
        </Flex>
        <Flex align="center">
          <Typography.Text>
            Procesos en {currentData.requestArea}
          </Typography.Text>
          <Pagination
            total={processLines.length * 10}
            onChange={(page) => setCurrentPage(page)}
          />
        </Flex>
        <Card
          className={"showme"}
          style={{
            border: "1px solid",
            width: "100%",
            height: "45dvh",
            overflow: "auto",
          }}
        >
          <Steps
            size="small"
            direction="vertical"
            current={1}
            items={currentSteps}
          />
        </Card>
      </Flex>
    )
  );
}
