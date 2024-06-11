import { Col, Flex, Form, Input, Row } from "antd";
import React from "react";

function LaboralStep({index}) {
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
          name={`business-name-${index}`}
          rules={[
            {
              required: true,
              message: "Por favor, introduce un nombre",
            },
          ]}
        >
          <Input placeholder="Inserta una empresa" id={`business-name-${index}`}/>
        </Form.Item>
        <Form.Item
          label="Cargo desempeñado"
          name={`business-labour-${index}`}
          rules={[
            {
              required: true,
              message: "Por favor, introduce un cargo",
            },
          ]}
        >
          <Input placeholder="Inserta una cargo" id={`business-labour-${index}`} />
        </Form.Item>
        <Form.Item
          label="Tiempo laborado"
          name={`business-time-${index}`}
          rules={[
            {
              required: true,
              message: "Por favor, introduce un periodo",
            },
          ]}
        >
          <Input placeholder="Inserta una periodo" id={`business-time-${index}`}/>
        </Form.Item>
        <Form.Item
          label="Motivo de retiro"
          name={`business-motive-${index}`}
          rules={[
            {
              required: true,
              message: "Por favor, introduce un motivo",
            },
          ]}
        >
          <Input placeholder="Inserta una motivo" id={`business-motive-${index}`} />
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
