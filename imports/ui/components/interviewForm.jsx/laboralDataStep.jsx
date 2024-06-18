import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import React from "react";

import timeOptions from "../../pages/bpm/data/time.json";

export default function LaboralDataStep() {
  return (
    <Form.List name={"laboralExperience"}>
      {(fields, { add, remove }, { errors }) => (
        <Row gutter={[16, 16]} style={{ width: "75lvw" }}>
          <Button type="primary" onClick={() => add()} block>
            + Agregar Experiencia
          </Button>
          {fields.map((field, index) => (
            <Col span={11} key={field.key}>
              <Card
                actions={[
                  <Button
                    danger
                    onClick={() => remove(field.name)}
                    icon={<DeleteOutlined />}
                  >
                    Eliminar
                  </Button>,
                ]}
                style={{
                  border: "1px solid gray",
                  width: "27rem",
                  background: "#aed4e8",
                }}
                hoverable
              >
                Nombre de la empresa
                <Form.Item
                  name={[field.name, "companyName"]}
                  rules={[
                    {
                      required: true,
                      message: "Introduce un nombre de empresa",
                    },
                  ]}
                  hasFeedback
                >
                  <Input style={{ width: "22.5rem" }} />
                </Form.Item>
                Cargo desempeñado
                <Form.Item
                  name={[field.name, "laboredPosition"]}
                  rules={[
                    {
                      required: true,
                      message: "Introduce un cargo",
                    },
                  ]}
                  hasFeedback
                >
                  <Input style={{ width: "22.5rem" }} />
                </Form.Item>
                Tiempo laborado
                <Flex>
                  <Form.Item
                    name={[field.name, "companyTime", "cuantity"]}
                    rules={[
                      {
                        required: true,
                        message: "Introduce una cantidad",
                      },
                    ]}
                    hasFeedback
                  >
                    <InputNumber style={{ width: "10rem" }} type="number" />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "companyTime", "timePart"]}
                    rules={[
                      {
                        required: true,
                        message: "Introduce una unidad de tiempo",
                      },
                    ]}
                    hasFeedback
                  >
                    <Select options={timeOptions} style={{ width: "10rem" }} />
                  </Form.Item>
                </Flex>
                Motivo de retiro
                <Form.Item
                  name={[field.name, "dismissMotive"]}
                  rules={[
                    {
                      required: true,
                      message: "Introduce un motivo",
                    },
                  ]}
                  hasFeedback
                >
                  <Input style={{ width: "22.5rem" }} />
                </Form.Item>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Form.List>
  );
}
