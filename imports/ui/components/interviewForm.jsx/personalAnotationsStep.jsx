import { Col, Divider, Flex, Form, Input, Row } from "antd";
import React from "react";
import ReactQuill from "react-quill";
import { formats, modules } from "../../pages/styles/quillStyle";

export default function PersonalAnotationsStep() {
  return (
    <Flex vertical>
      <Row>
        <Flex style={{height: "16rem"}}>
          <Col xs={16} sm={24}>
            <Form.Item name={'personalAnnotation'}>
              <ReactQuill
                formats={formats}
                modules={modules}
                style={{
                  height: "10rem",
                  width: "75vw",
                }}
                id="info"
                placeholder="Ampliar informacion sociodemografica y familiar. "
              />
            </Form.Item>
          </Col>
        </Flex>
      </Row>
      <Divider>Tallas</Divider>
      <Row>
        <Col>
          <Form.Item
            label="Camisa"
            name={`sizeShirt`}
            rules={[
              {
                required: true,
                message: "Por favor, introduce la talla",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Inserta talla de camisa" id={`sizeShirt`} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="Pantalón"
            name={`sizePants`}
            rules={[
              {
                required: true,
                message: "Por favor, introduce la talla",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Inserta talla de pantalones" id={`sizePants`} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="Zapatos"
            name={`sizeShoes`}
            rules={[
              {
                required: true,
                message: "Por favor, introduce la talla",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Inserta talla de zapatos" id={`sizeShoes`} />
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
}
