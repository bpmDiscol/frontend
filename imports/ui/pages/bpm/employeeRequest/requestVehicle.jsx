import { Button, Col, Empty, Form, Input, Row, Spin, Switch } from "antd";
import React from "react";

export default function RequestVehicle({ requestData, update }) {
  const [isVehicle, setIsVehicle] = React.useState(requestData?.isVehicle);


  if (isVehicle)
    return (
      <Row style={{ padding: "10px 20px", width: "90%" }}>
        <Col>
          <Form.Item label="Se requiere vehiculo" name="vehicle-required">
            <Switch
            id="require-vehicle-switch"
              onChange={() => {
                setIsVehicle(!isVehicle);
                update("isVehicle", false);
              }}
              checked={isVehicle}
            />
          </Form.Item>
          <Form.Item label="Tipo de vehiculo">
            <Input
              id="vehicleType"
              defaultValue={requestData?.vehicleType}
              onChange={(e) => update("vehicleType", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Tipo de licencia">
            <Input
              id="licenceType"
              defaultValue={requestData?.licenceType}
              onChange={(e) => update("licenceType", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Valor de rodamiento">
            <Input
              id="bearingValue"
              defaultValue={requestData?.bearingValue||0}
              type="number"
              onChange={(e) => update("bearingValue", e.target.value)}
              addonBefore='$'
            />
          </Form.Item>
        </Col>
      </Row>
    );
  if (!isVehicle)
    return (
      <Empty description={""} style={{ padding: "50px" }}>
        <Button
          id="request-vehicle-button"
          onClick={() => {
            setIsVehicle(true);
            update("isVehicle", true);
          }}
          type="primary"
        >
          Requerir vehiculo
        </Button>
      </Empty>
    );
}
