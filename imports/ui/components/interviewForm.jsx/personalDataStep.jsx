import {
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import React from "react";

import statusOptions from "../../pages/bpm/data/personalStatus.json";

const { Text } = Typography;

export default function PersonalDataStep() {
  const [isPreviusEmployee, setIsPreviusEmployee] = React.useState(false);
  const [isAboutBussiness, setIsAboutBussiness] = React.useState(false);
  const [isAboutFamily, setIsAboutFamily] = React.useState(false);
  const [applicationType, setApplicationType] = React.useState("internal");
  return (
    <Flex vertical gap={16}>
      <Row gutter={32}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item name={"applicationType"} label="Tipo de postulación">
            <Space>
              <Radio.Group
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value)}
              >
                <Radio.Button value="internal">Interna</Radio.Button>
                <Radio.Button value="external">Externa</Radio.Button>
              </Radio.Group>
            </Space>
          </Form.Item>
          <Col xs={{ span: 0 }} lg={{ span: 24 }}>
            <Divider style={{ margin: "20px 0" }} />
          </Col>

          <Form.Item
            name={"id"}
            label="Cedula"
            rules={[
              {
                required: true,
                message: "Por favor, introduce una identificación",
              },
            ]}
          >
            <Input placeholder="inserta una identificación" />
          </Form.Item>
          <Form.Item
            name={"city"}
            label="Ciudad"
            rules={[
              {
                required: true,
                message: "Por favor, introduce una ciudad",
              },
            ]}
          >
            <Input placeholder="inserta la ciudad" />
          </Form.Item>
          <Form.Item
            name={"phone"}
            label="Teléfono"
            rules={[
              {
                required: true,
                message: "Por favor, introduce una teléfono",
              },
            ]}
          >
            <Input placeholder="inserta un teléfono" />
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            name={"age"}
            label="Edad"
            rules={[
              {
                required: true,
                message: "Por favor, introduce una edad",
              },
            ]}
          >
            <Input placeholder="inserta una edad" />
          </Form.Item>
          <Form.Item
            name={"status"}
            label="Estado civil"
            rules={[
              {
                required: true,
                message: "Por favor, introduce un estado civil",
              },
            ]}
          >
            <Select
              placeholder="Selecciona un estado"
              options={statusOptions}
            />
          </Form.Item>
          <Form.Item
            name={"residence"}
            label="Lugar de residencia"
            rules={[
              {
                required: true,
                message: "Por favor, introduce un lugar",
              },
            ]}
          >
            <Input placeholder="inserta un lugar de residencia" />
          </Form.Item>
          <Form.Item
            name={"position"}
            label="Cargo aspirado"
            rules={[
              {
                required: true,
                message: "Por favor, introduce un cargo",
              },
            ]}
          >
            <Input placeholder="inserta un cargo" />
          </Form.Item>

          <Form.Item
            name={"SalaryGoal"}
            label="Aspiración salarial"
            rules={[
              {
                required: true,
                message: "Por favor, introduce una aspiración salarial",
              },
            ]}
          >
            <Input placeholder="inserta una cifra" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Space>
            <Text>¿Ha trabajado antes en discol?</Text>
          </Space>

          <Form.Item name={"isPreviusEmployee"}>
            <Space>
              <Switch
                value={isPreviusEmployee}
                onChange={() => setIsPreviusEmployee(!isPreviusEmployee)}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
              {isPreviusEmployee && (
                <Input
                  placeholder="Fecha de retiro"
                  style={{ width: "190%" }}
                />
              )}
            </Space>
          </Form.Item>

          <Space>
            <Text>¿Tiene familiares trabajando en DISCOL?</Text>
          </Space>
          <Form.Item
            name={"isPreviusEmployee"}
            rules={[
              {
                message: "Por favor, introduce el parentezco",
              },
            ]}
          >
            <Space>
              <Switch
                value={isAboutFamily}
                onChange={() => setIsAboutFamily(!isAboutFamily)}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
              {isAboutFamily && (
                <Input placeholder="Parentezco" style={{ width: "190%" }} />
              )}
            </Space>
          </Form.Item>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Space>
            <Text>
              ¿Ha laborado en empresas o contratistas vinculadas a Aguas de
              Cartagena, Gases del Caribe o Surtigas?
            </Text>
          </Space>
          <Form.Item name={"isPreviusEmployee"}>
            <Space>
              <Switch
                value={isAboutBussiness}
                onChange={() => setIsAboutBussiness(!isAboutBussiness)}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
              {isAboutBussiness && (
                <Input
                  placeholder="Mencionar empresa"
                  style={{ width: "192%" }}
                />
              )}
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
}
