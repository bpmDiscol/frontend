import React from "react";
import academicLevelOptions from "../../pages/bpm/data/academicLevel.json";
import { Col, Flex, Form, Input, Row, Select } from "antd";
import InputDataList from "./inputDataList";

export default function AcademicDataStep({ update, form }) {
  
  return (
    <Flex vertical gap={16} style={{ width: "75lvw" }}>
      <Row gutter={32}>
        <Col span={24}>
          <Form.Item
            name={"academicLevel"}
            label="Nivel académico"
            rules={[
              {
                required: true,
                message: "Por favor, seleccione un nivel académico",
              },
            ]}
            hasFeedback
          >
            <Select
              placeholder="Selecciona un nivel"
              options={academicLevelOptions}
              id={`academic-level`}
            />
          </Form.Item>
          <Form.Item
            name={"grade"}
            label="Título obtenido"
            rules={[
              {
                required: true,
                message: "Por favor, introduce un título",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Inserta una título" id={`academic-grade`} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={32}>
        <Col
          xs={22}
          lg={11}
          style={{
            background: "#2271b1",
            padding: "10px 0 10px 20px",
            borderRadius: "10px",
            margin: "0 0 32px 32px",
          }}
        >
          <InputDataList
            key={"study"}
            title={"Estudios Complementarios"}
            placeholder="Inserta un estudio complementario"
            id={"study"}
            update={update}
            form={form}
          />
        </Col>
        <Col
          xs={22}
          lg={11}
          style={{
            background: "#2271b1",
            padding: "10px 0 10px 20px",
            borderRadius: "10px",
            margin: "0 0 32px 32px",
          }}
        >
          <InputDataList
            key={"systemKnown"}
            title={"Sistemas o software que conoce"}
            placeholder="Inserta algun sistema o software"
            id={"systemKnown"}
            update={update}
            form={form}
          />
        </Col>
      </Row>
    </Flex>
  );
}
