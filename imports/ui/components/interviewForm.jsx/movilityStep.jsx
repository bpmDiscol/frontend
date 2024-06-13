import { Col, Flex, Form, Input, Radio, Row, Space, Switch } from "antd";
import React from "react";

export default function MovilityStep({ update, form }) {
  const [revisionVial, setRevisionVial] = React.useState();

  React.useEffect(() => {
    setRevisionVial(form.getFieldValue("revisionVial") || "no");
  }, []);
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
            rules={[
              {
                transform: (value) => {
                  if (!value) update({ field: `isVehicle`, value: false });
                },
              },
            ]}
            name={`isVehicle`}
            valuePropName="checked"
          >
            <Switch
              id={`isVehicle`}
              value={false}
              checkedChildren="Si"
              unCheckedChildren="No"
            />
          </Form.Item>

          <Form.Item
            label="¿Cuenta con licencia vigente?"
            rules={[
              {
                transform: (value) => {
                  if (!value) update({ field: `isValidLicence`, value: false });
                },
              },
            ]}
            name={`isValidLicence`}
            valuePropName="checked"
          >
            <Switch
              id={`isValidLicence`}
              checkedChildren="Si"
              unCheckedChildren="No"
            />
          </Form.Item>

          <Form.Item
            label="¿Documentos al dia?"
            rules={[
              {
                transform: (value) => {
                  if (!value)
                    update({ field: `isValidDocuments`, value: false });
                },
              },
            ]}
            name={`isValidDocuments`}
            valuePropName="checked"
          >
            <Switch
              id={`isValidDocuments`}
              checkedChildren="Si"
              unCheckedChildren="No"
            />
          </Form.Item>
          <Form.Item
            label="Placa del vehículo/moto"
            name={`vechiclePlate`}
            rules={[
              {
                transform: (value) => {
                  if (!value) update({ field: `vechiclePlate`, value: " " });
                },
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Inserta una placa" id={`vechiclePlate`} />
          </Form.Item>
          <Form.Item
            label="Nombre del propietario"
            name={`vehicle_owner_name`}
            rules={[
              {
                transform: (value) => {
                  if (!value)
                    update({ field: `vehicle_owner_name`, value: " " });
                },
              },
            ]}
            hasFeedback
          >
            <Input
              placeholder="Inserta el nombre del propietario"
              id={`vehicle_owner_name`}
            />
          </Form.Item>
          <Form.Item
            label="Cédula del propietario"
            name={`vehicle_owner_id`}
            rules={[
              {
                transform: (value) => {
                  if (!value)
                    update({ field: `vehicle_owner_id`, value: "  " });
                },
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Inserta la cedula" id={`vehicle_owner_id`} />
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
            rules={[
              {
                transform: (value) => {
                  if (!value) update({ field: `isLicence`, value: false });
                },
              },
            ]}
            name={`isLicence`}
            valuePropName="checked"
          >
            <Switch
              id={`isLicence`}
              checkedChildren="Si"
              unCheckedChildren="No"
            />
          </Form.Item>
          <Form.Item
            label="¿Cumple/Vigente SOAT?"
            rules={[
              {
                transform: (value) => {
                  if (!value) update({ field: `isSOAT`, value: false });
                },
              },
            ]}
            name={`isSOAT`}
            valuePropName="checked"
          >
            <Switch id={`isSOAT`} checkedChildren="Si" unCheckedChildren="No" />
          </Form.Item>
          <Form.Item
            label="¿Cumple/Vigente tecnomecánica?"
            rules={[
              {
                transform: (value) => {
                  if (!value)
                    update({ field: `isTecnomecanica`, value: false });
                },
              },
            ]}
            name={`isTecnomecanica`}
            valuePropName="checked"
          >
            <Switch
              id={`isTecnomecanica`}
              checkedChildren="Si"
              unCheckedChildren="No"
            />
          </Form.Item>
          <Form.Item
            label="¿Aprobado revisión vial?"
            name={`revisionVial`}
            valuePropName="value"
            initialValue={revisionVial || "no"}
            rules={[
              {
                transform: (value) => {
                  update({ field: `revisionVial`, value });
                },
              },
            ]}
          >
            <Radio.Group
              value={revisionVial}
              onChange={(e) => {
                update({ field: "revisionVial", value: e.target.value });
                setRevisionVial(e.target.value);
              }}
              buttonStyle="solid"
            >
              <Radio.Button value="yes">Si</Radio.Button>
              <Radio.Button value="no">No</Radio.Button>
              <Radio.Button value="NA">N/A</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
}
