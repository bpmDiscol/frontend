import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Switch,
} from "antd";
import React from "react";

export default function RequestVehicle() {
  const [isVehicle, setIsVehicle] = React.useState(false);

  if (isVehicle)
    return (
      <Row style={{ padding: "10px 20px", width: "90%" }}>
        <Col>
          <Form.Item label="Se requiere vehiculo" name="vehicle-required">
            <Switch
              onChange={() => setIsVehicle(!isVehicle)}
              checked={isVehicle}
            />
          </Form.Item>
          <Form.Item label="Tipo de vehiculo">
            <Input />
          </Form.Item>
          <Form.Item label="Tipo de licencia">
            <Input />
          </Form.Item>
          <Form.Item label="Valor de rodamiento">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    );
  if (!isVehicle)
    return (
      <Empty description={""} style={{ padding: "50px" }}>
        <Button onClick={() => setIsVehicle(true)} type="primary">
          Requerir vehiculo
        </Button>
      </Empty>
    );
}
