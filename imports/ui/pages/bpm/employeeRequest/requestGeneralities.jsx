import { Col, Form, Input, Row, Select, Space, Switch } from "antd";
import React from "react";

const motiveOptions = [
  {
    label: "Nuevo cargo",
    value: "new-charge",
  },
  {
    label: "Aumento del personal",
    value: "upgrade",
  },
  {
    label: "Licencia",
    value: "licence",
  },
  {
    label: "Nuevo proyecto",
    value: "new-proyect",
  },
  {
    label: "Reemplazo",
    value: "replacement",
  },
  {
    label: "Incapacidad",
    value: "inhability",
  },
];

const timeOptions = [
  { label: "dia", value: "dia" },
  { label: "semana", value: "semana" },
  { label: "mes", value: "mes" },
  { label: "año", value: "año" },
];

const contractTypeOptions = [
  {
    label: "Obra o labor contratada",
    value: "labour",
  },
  {
    label: "Indefinido",
    value: "undefined",
  },
  {
    label: "Termino fijo",
    value: "fixed",
  },
  {
    label: "Aprendizaje",
    value: "learning",
  },
];

const workingDayOptions = [
  {
    label: "Tiempo completo",
    value: "full-time",
  },
  {
    label: "Medio completo",
    value: "mid-time",
  },
  {
    label: "Trabajo por dias",
    value: "day-time",
  },
];
export default function RequestGeneralities() {
  const [isBonus, setIsBonus] = React.useState(false);
  return (
    <Row gutter={32} style={{ padding: "10px 20px", width: "90%" }}>
      <Col span={12}>
        <Form.Item label="Puesto solicitado" name="companyPosition">
          <Input />
        </Form.Item>

        <Form.Item label="Sede" name="site">
          <Input />
        </Form.Item>
        <Form.Item label="Area/proyecto" name="area_proyect">
          <Input />
        </Form.Item>
        <Form.Item label="Lugar de trabajo" name="area_proyect">
          <Input />
        </Form.Item>
        <Form.Item label="Motivo del requerimiento" name="area_proyect">
          <Select defaultValue="Nuevo cargo" options={motiveOptions} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Salario" name="area_proyect">
          <Input addonBefore="$" />
        </Form.Item>
        <Form.Item label="Jornada laboral" name="area_proyect">
          <Select
            options={workingDayOptions}
            defaultValue={"Tiempo completo"}
          />
        </Form.Item>
        <Form.Item label="Tipo de contrato" name="area_proyect">
          <Select options={contractTypeOptions} defaultValue={"Indefinido"} />
        </Form.Item>
        <Space style={{ width: "100%", justifyContent: "space-around" }}>
          <Form.Item label="Dentro del manual de funciones" name="area_proyect">
            <Switch />
          </Form.Item>
          <Form.Item label="Bono salarial" name="area_proyect">
            <Switch
              style={{ margin: "0 5px" }}
              onChange={() => setIsBonus(!isBonus)}
              checked={isBonus}
            />
          </Form.Item>
        </Space>
        <Form.Item style={{ width: "100&" }}>
          {isBonus && (
            <Space.Compact>
              <Input addonBefore="$" />
              <Input addonBefore="cada" defaultValue={1} />
              <Select defaultValue={"mes"} options={timeOptions} />
            </Space.Compact>
          )}
        </Form.Item>
      </Col>
    </Row>
  );
}
