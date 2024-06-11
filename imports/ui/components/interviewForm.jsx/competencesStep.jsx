import React from "react";
import evaluationOptions from "../../pages/bpm/data/evaluation.json";
import { Col, Flex, Form, Row, Select } from "antd";

export default function CompetencesStep() {
  return (
    <Flex vertical gap={16} style={{ width: "75lvw" }}>
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
            label="¿Cuenta con moto o vehículo?"
            rules={[{ required: false }]}
            name={`isVehicle`}
          >
            <Select
              options={evaluationOptions}
              placeholder="Selecciona una calificación"
            />
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
}
