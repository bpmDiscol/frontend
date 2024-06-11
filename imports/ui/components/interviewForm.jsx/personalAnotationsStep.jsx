import { Col, Flex, Form, Row } from "antd";
import React from "react";
import ReactQuill from "react-quill";
import { formats, modules } from "../../pages/styles/quillStyle";

export default function PersonalAnotationsStep() {
  return (
      <Row>
        <Col xs={16} sm={24}>
          <Form.Item>
            <ReactQuill
              formats={formats}
              modules={modules}
              style={{
                height: "10lh",
                width: "calc(75vw)",
              }}
              id="info"
              placeholder="Ampliar informacion sociodemografica y familiar. "
            />
          </Form.Item>
        </Col>
      </Row>
  );
}
