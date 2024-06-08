import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
} from "antd";
import React from "react";

import statusOptions from "../data/personalStatus.json";
import { UserOutlined } from "@ant-design/icons";
import { formats, modules } from '../../styles/quillStyle';
import ReactQuill from "react-quill";

export default function EmployeeRequestInterviewForm() {
  const [isPreviusEmployee, setIsPreviusEmployee] = React.useState(false);
  const [isAboutBussiness, setIsAboutBussiness] = React.useState(false);
  const [isAboutFamily, setIsAboutFamily] = React.useState(false);


  return (
    <Flex gap={32}>
      <Flex vertical>
        <Button shape="circle" icon={<UserOutlined />} />
      </Flex>
      <Form layout="vertical" requiredMark={false}>
        <Row gutter={32}>
          <Col span={12} title="Generalidades">
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
              name={"applicationType"}
              label="Tipo de postulación"
              rules={[
                {
                  required: true,
                  message: "Por favor, introduce un tipo de postulación",
                },
              ]}
            >
              <Input placeholder="postulación" />
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
          <Col span={12} title="Datos personales">
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
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item
              name={"residence"}
              label="lugar de residencia"
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
              name={"isPreviusEmployee"}
              label="¿Ha trabajado antes en discol?"
            >
              <Space>
                <Space>
                  <Switch
                    value={isPreviusEmployee}
                    onChange={() => setIsPreviusEmployee(!isPreviusEmployee)}
                  />
                </Space>
                {isPreviusEmployee && <Input placeholder="Fecha de retiro" />}
              </Space>
            </Form.Item>
            <Form.Item
              name={"isPreviusEmployee"}
              label="¿Ha laborado en empresas o contratistas vinculadas a Aguas de Cartagena, Gases del Caribe o Surtigas?"
            >
              <Space>
                <Space>
                  <Switch
                    value={isAboutBussiness}
                    onChange={() => setIsAboutBussiness(!isAboutBussiness)}
                  />
                </Space>
                {isAboutBussiness && <Input placeholder="Mencionar empresa" />}
              </Space>
            </Form.Item>
            <Form.Item
              name={"isPreviusEmployee"}
              label="¿Tiene familiares trabajando en DISCOL?"
            >
              <Space>
                <Space>
                  <Switch
                    value={isAboutFamily}
                    onChange={() => setIsAboutFamily(!isAboutFamily)}
                  />
                </Space>
                {isAboutFamily && <Input placeholder="Parentezco" />}
              </Space>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
          Información personal/familiar
            <ReactQuill
              formats={formats}
              modules={modules}
              style={{
                height: "10lh",
                width: "100%",
                marginBottom: '80px'
              }}
              id="info"
            />
          </Col>
        </Row>
      </Form>
    </Flex>
  );
}
