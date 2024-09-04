import React from "react";
import { Col, Flex, Form, Input, Radio, Row } from "antd";
const { TextArea } = Input;

export default function FinalConceptStep({ update, form }) {
  return (
    <Row>
      <Flex style={{ height: "16rem" }}>
        <Col xs={16} sm={20}>
          <Form.Item
            style={{ height: "16rem" }}
            name={"finalConcept"}
            rules={[
              {
                required: true,
                message:
                  "Por favor, introduce tus observaciones sobre evaluación técnica",
              },
            ]}
            hasFeedback
          >
            <TextArea
              style={{
                height: "10rem",
                width: "75vw",
              }}
              id="finalConcept"
              placeholder="concepto final"
            />
          </Form.Item>

          <Flex justify="center" align="center" gap={32}>
            <h3>¿Candidato Seleccionado?</h3>
            <Form.Item
              label="¿Candidato Seleccionado?"
              noStyle
              name={`selected`}
              valuePropName="value"
              rules={[
                {
                  transform: (value) => {
                    update({ field: `selected`, value });
                  },
                },
              ]}
            >
              <Radio.Group
                onChange={(e) => {
                  update({ field: "selected", value: e.target.value });
                }}
                buttonStyle="solid"
                value={form.getFieldValue("selected")}
                size="large"
              >
                <Radio.Button type="solid" value={true}>
                  Seleccionado
                </Radio.Button>
                <Radio.Button value={false}>No Seleccionado</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Flex>
        </Col>
      </Flex>
    </Row>
  );
}
