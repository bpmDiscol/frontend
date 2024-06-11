import React from "react";
import academicLevelOptions from "../../pages/bpm/data/academicLevel.json";
import { Button, Col, Flex, Form, Input, List, Row, Select, Space } from "antd";
import { DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";
import InputDataList from "./inputDataList";

export default function AcademicDataStep() {
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
          >
            <Select
              placeholder="Selecciona un nivel"
              options={academicLevelOptions}
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
          >
            <Input placeholder="Inserta una título" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={32}>
        <Col
          span={11}
          style={{
            background: "#1677ff",
            padding: "10px 0 10px 20px",
            borderRadius: "10px",
            marginLeft:32
          }}
        >
          <InputDataList
            title={"Estudios Complementarios"}
            placeholder="Inserta un estudio complementario"
          />
        </Col>
        <Col
          span={11}
          style={{
            background: "#1677ff",
            padding: "10px 0 10px 20px",
            borderRadius: "10px",
            marginLeft:32
          }}
        >
          <InputDataList
            title={"Sistemas o software que conoce"}
            placeholder="Inserta algun sistema o software"
          />
        </Col>
      </Row>
    </Flex>
  );
}
