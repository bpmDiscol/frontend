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

export default function PersonalDataStep({ form, update, requestEmployee }) {
  const [isPreviusEmployee, setIsPreviusEmployee] = React.useState();
  const [isAboutBussiness, setIsAboutBussiness] = React.useState();
  const [isAboutFamily, setIsAboutFamily] = React.useState();

  React.useEffect(() => {
    setIsPreviusEmployee(form.getFieldValue("isPreviusEmployee"));
    setIsAboutBussiness(form.getFieldValue("isAboutBussiness"));
    setIsAboutFamily(form.getFieldValue("isAboutFamily"));
  }, []);

  return (
    <Flex vertical gap={16}>
      <Row gutter={32}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Form.Item
            name={"applicationType"}
            label="Tipo de postulación"
            valuePropName="value"
            initialValue={"internal"}
            rules={[
              {
                required: true,
              },
            ]}
            hasFeedback
          >
            <Radio.Group>
              <Radio.Button value="internal">Interna</Radio.Button>
              <Radio.Button value="external">Externa</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={"email"}
            label="Email"
            rules={[
              {
                required: true,
                message: "Por favor, introduce un correo electrónico válido",
                type: "email",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="inserta un correo" />
          </Form.Item>

          <Form.Item
            name={"id"}
            label="Cedula"
            rules={[
              {
                required: true,
                message: "Por favor, introduce una identificación",
              },
            ]}
            hasFeedback
            normalize={(value) => value.replace(/[^\w\s\-]/, "")}
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
            hasFeedback
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
            hasFeedback
            normalize={(value) => value.replace(/[^\d+() ]/, "")}
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
            normalize={(value) => value.replace(/[^\d]/, "")}
            hasFeedback
          >
            <Input min={10} max={99} placeholder="inserta una edad" />
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
            hasFeedback
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
            hasFeedback
          >
            <Input placeholder="inserta un lugar de residencia" />
          </Form.Item>
          <Form.Item
            name={"expectedPosition"}
            label="Cargo aspirado"
            rules={[
              {
                required: true,
                message: "Por favor, introduce un cargo",
              },
            ]}
            hasFeedback
          >
            <Input
              placeholder={"Sugerido: " + requestEmployee?.companyPosition}
            />
          </Form.Item>

          <Form.Item
            name={"salaryGoal"}
            label="Aspiración salarial"
            rules={[
              {
                required: true,
                message: "Por favor, introduce una aspiración salarial",
              },
            ]}
            help={"Propuesto: " + requestEmployee?.salary} 
            hasFeedback
            normalize={(value) => {
              return new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(parseInt(value.replace(/\$\s?|(,*)\./g, "")) || 0);
            }}
          >
            <Input placeholder={"Propuesto: " + requestEmployee?.salary} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Flex vertical>
            <Space>
              <Text>¿Ha trabajado antes en discol?</Text>

              <Form.Item
                name={"isPreviusEmployee"}
                valuePropName="checked"
                rules={[
                  {
                    transform: (value) => {
                      if (!value)
                        update({ field: `isPreviusEmployee`, value: false });
                    },
                  },
                ]}
              >
                <Switch
                  id={"isPreviusEmployee"}
                  value={isPreviusEmployee}
                  onChange={() => setIsPreviusEmployee(!isPreviusEmployee)}
                  checkedChildren="Si"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </Space>
            {isPreviusEmployee && (
              <Flex vertical gap={8}>
                <Form.Item
                  name={"retirementMotive"}
                  label="Motivo de retiro"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, introduce un motivo",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Motivo de retiro" />
                </Form.Item>
                <Form.Item
                  name={"retirementDate"}
                  label="Fecha de retiro"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, introduce una fecha",
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Motivo  de retiro" />
                </Form.Item>
              </Flex>
            )}
          </Flex>

          <Space>
            <Text>¿Tiene familiares trabajando en DISCOL?</Text>
          </Space>
          <Space>
            <Form.Item
              valuePropName="checked"
              name={"isAboutFamily"}
              rules={[
                {
                  transform: (value) => {
                    if (!value)
                      update({ field: `isAboutFamily`, value: false });
                  },
                },
              ]}
            >
              <Switch
                value={isAboutFamily}
                onChange={() => setIsAboutFamily(!isAboutFamily)}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </Form.Item>
          </Space>
          {isAboutFamily && (
            <Flex vertical gap={8}>
              <Form.Item
                name={"kinship"}
                label="Parentezco"
                rules={[
                  {
                    required: true,
                    message: "Por favor, introduce el parentezco",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Parentezco" />
              </Form.Item>
              <Form.Item
                name={"kinName"}
                label="Nombre del familiar"
                rules={[
                  {
                    required: true,
                    message: "Por favor, introduce el nombre",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nombre del familiar" />
              </Form.Item>
            </Flex>
          )}
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Space>
            <Text>
              ¿Ha laborado en empresas o contratistas vinculadas a Aguas de
              Cartagena, Gases del Caribe o Surtigas?
            </Text>

            <Form.Item
              name={"isAboutBussiness"}
              valuePropName="checked"
              rules={[
                {
                  transform: (value) => {
                    if (!value)
                      update({ field: `isAboutBussiness`, value: false });
                  },
                },
              ]}
            >
              <Switch
                value={isAboutBussiness}
                onChange={() => setIsAboutBussiness(!isAboutBussiness)}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </Form.Item>
          </Space>
          {isAboutBussiness && (
            <Flex vertical gap={8}>
              <Form.Item
                name={"aboutBusinessName"}
                label="Nombre de la empresa"
                rules={[
                  {
                    required: true,
                    message: "Por favor, introduce el nombre",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Mencionar empresa" />
              </Form.Item>
              <Form.Item
                name={"aboutBusinessMotive"}
                label="Motivo de retiro"
                rules={[
                  {
                    required: true,
                    message: "Por favor, introduce el motivo",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Motivo de retiro" />
              </Form.Item>
              <Form.Item
                name={"aboutBusinessBoss"}
                label="Nombre del jefe inmediato"
                rules={[
                  {
                    required: true,
                    message: "Por favor, introduce el nombre",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Jefe inmediato" />
              </Form.Item>
            </Flex>
          )}
        </Col>
      </Row>
    </Flex>
  );
}
