import { Col, Flex, Form, Input, Radio, Row, Space, Switch } from "antd";
import React from "react";

export default function MovilityStep() {
  const [revisionVial, setRevisionVial] = React.useState("no");
  return (
    <Flex vertical gap={16} style={{ width: "75lvw" }}>
      <Row gutter={32}>
        <Col
          xs={22}
          sm={11}
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
            <Space>
              <Switch
                id={`isVehicle`}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="¿Cuenta con licencia vigente?"
            rules={[{ required: false }]}
            name={`isValidLicence`}
          >
            <Space>
              <Switch
                id={`isValidLicence`}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="¿Documentos al dia?"
            rules={[{ required: false }]}
            name={`isValidDocuments`}
          >
            <Space>
              <Switch
                id={`isValidDocuments`}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="Placa del vehículo/moto"
            name={`vechiclePlate`}
            rules={[
              {
                required: true,
                message: "Por favor, introduce una placa",
              },
            ]}
          >
            <Input placeholder="Inserta una placa" id={`vechiclePlate`} />
          </Form.Item>
          <Form.Item
            label="Nombre del propietario"
            name={`vehicle-owner-name`}
            rules={[
              {
                required: true,
                message: "Por favor, introduce un nombre",
              },
            ]}
          >
            <Input
              placeholder="Inserta el nombre del propietario"
              id={`vehicle-owner-name`}
            />
          </Form.Item>
          <Form.Item
            label="Cédula del propietario"
            name={`vehicle-owner-id`}
            rules={[
              {
                required: true,
                message: "Por favor, introduce una cedula",
              },
            ]}
          >
            <Input placeholder="Inserta la cedula" id={`vehicle-owner-id`} />
          </Form.Item>
        </Col>
        <Col
          xs={22}
          sm={11}
          style={{
            background: "#67abe0",
            padding: "10px 0 10px 20px",
            borderRadius: "10px",
            margin: "0 0 32px 32px",
          }}
        >
          <Form.Item
            label="¿Cumple/Vigente licencia?"
            rules={[{ required: false }]}
          >
            <Space>
              <Switch
                id={`isLicence`}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="¿Cumple/Vigente SOAT?"
            rules={[{ required: false }]}
          >
            <Space>
              <Switch
                id={`isSOAT`}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="¿Cumple/Vigente tecnomecánica?"
            rules={[{ required: false }]}
          >
            <Space>
              <Switch
                id={`isTecnomecanica`}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="¿Aprobado revisión vial?"
            rules={[{ required: false }]}
          >
            <Space>
              <Radio.Group
                value={revisionVial}
                onChange={(e) => setRevisionVial(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="yes">Si</Radio.Button>
                <Radio.Button value="no">No</Radio.Button>
                <Radio.Button value="NA">N/A</Radio.Button>
              </Radio.Group>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
}
