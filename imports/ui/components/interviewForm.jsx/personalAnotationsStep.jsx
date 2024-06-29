import { Col, Divider, Flex, Form, Input, InputNumber, Row, Select } from "antd";
import React from "react";
import ReactQuill from "react-quill";
import { formats, modules } from "../../pages/styles/quillStyle";

export default function PersonalAnotationsStep() {
  const camisas = [
    { label: "Extra Small (XS)", value: "XS" },
    { label: "Small (S)", value: "S" },
    { label: "Medium (M)", value: "M" },
    { label: "Large (L)", value: "L" },
    { label: "Extra Large (XL)", value: "XL" },
    { label: "Double Extra Large (XXL)", value: "XXL" },
  ];

  const zapatos = [
    { label: "35 (CO 35)", value: "CO 35" },
    { label: "36 (CO 36)", value: "CO 36" },
    { label: "37 (CO 37)", value: "CO 37" },
    { label: "38 (CO 38)", value: "CO 38" },
    { label: "39 (CO 39)", value: "CO 39" },
    { label: "40 (CO 40)", value: "CO 40" },
    { label: "41 (CO 41)", value: "CO 41" },
    { label: "42 (CO 42)", value: "CO 42" },
    { label: "43 (CO 43)", value: "CO 43" },
    { label: "44 (CO 44)", value: "CO 44" },
    { label: "45 (CO 45)", value: "CO 45" },
    { label: "46 (CO 46)", value: "CO 46" },
    { label: "47 (CO 47)", value: "CO 47" },
  ];

  return (
    <Flex vertical>
      <Row>
        <Flex style={{ height: "16rem" }}>
          <Col xs={16} sm={24}>
            <Form.Item name={"personalAnnotation"}>
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
        <Col xs={24} sm={8}>
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
            <Select
              options={camisas}
              placeholder="Inserta talla de camisa"
              id={`sizeShirt`}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
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
            <InputNumber
              type="number"
              min={0}
              max={99}
              placeholder="Inserta talla de pantalones"
              id={`sizePants`}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
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
            <Select
              options={zapatos}
              placeholder="Inserta talla de zapatos"
              id={`sizeShoes`}
            />
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
}
