import { Col, Flex, Form, Input, Row } from "antd";
import React from "react";

function LaboralStep({ index }) {
  return (
    <Row gutter={32}>
      <Col
        xs={22}
        sm={12}
        style={{
          background: "#67abe0",
          padding: "10px 0 10px 20px",
          borderRadius: "10px",
          margin: "0 0 32px 32px",
        }}
      >
        <Form.Item
          label="Nombre de la empresa"
          name={`business_name_${index}`}
          rules={[
            {
              required: true,
              message: "Por favor, introduce un nombre",
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder="Inserta una empresa"
            id={`business_name_${index}`}
          />
        </Form.Item>
        <Form.Item
          label="Cargo desempeñado"
          name={`business_labour_${index}`}
          rules={[
            {
              required: true,
              message: "Por favor, introduce un cargo",
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder="Inserta una cargo"
            id={`business_labour_${index}`}
          />
        </Form.Item>
        <Form.Item
          label="Tiempo laborado"
          name={`business_time_${index}`}
          rules={[
            {
              required: true,
              message: "Por favor, introduce un periodo",
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder="Inserta una periodo"
            id={`business_time_${index}`}
          />
        </Form.Item>
        <Form.Item
          label="Motivo de retiro"
          name={`business_motive_${index}`}
          rules={[
            {
              required: true,
              message: "Por favor, introduce un motivo",
            },
          ]}
          hasFeedback
        >
          <Input
            placeholder="Inserta una motivo"
            id={`business_motive_${index}`}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}

export default function LaboralDataStep() {
  return (
    <Flex vertical gap={16} style={{ width: "75lvw" }}>
      {[1, 2].map((index) => {
        return <LaboralStep key={index} index={index} />;
      })}
    </Flex>
  );
}
