import React from "react";
import { Col, Flex, Form, Input, Row } from "antd";
const { TextArea } = Input;

export default function LeaderStep() {
  return (
    <div>
      <Row>
        <Col xs={0} sm={4}>
          <h3>Conocimientos Técnicos</h3>
        </Col>
        <Col xs={16} sm={20}>
          <Form.Item
            name={"tecnicalknowledge"}
            rules={[
              {
                message:
                  "Por favor, introduce tus conceptos sobre conocimiento técnico",
              },
            ]}
          >
            <TextArea
              style={{
                height: "10rem",
                width: "65vw",
              }}
              id="tecnicalknowledge"
              placeholder="Conocimientos Técnicos"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={0} sm={4}>
          <h3>Adaptación o aprendizaje frente al cargo</h3>
        </Col>
        <Col xs={16} sm={20}>
          <Form.Item
            name={"learningAdaptation"}
            rules={[
              {
                message:
                  "Por favor, introduce tus conceptos sobre adaptación o aprendizaje frente al cargo",
              },
            ]}
          >
            <TextArea
              style={{
                height: "10rem",
                width: "65vw",
              }}
              id="learningAdaptation"
              placeholder="Adaptación o aprendizaje frente al cargo"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={0} sm={4}>
          <h3>Observaciones de evaluación técnica</h3>
        </Col>
        <Col xs={16} sm={20}>
          <Form.Item
            name={"tecnicalEvaluation"}
            rules={[
              {
                message:
                  "Por favor, introduce tus observaciones sobre evaluación técnica",
              },
            ]}
          >
            <TextArea
              style={{
                height: "10rem",
                width: "65vw",
              }}
              id="tecnicalEvaluation"
              placeholder="Observaciones de evaluación técnica"
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
