import React from "react";
import academicLevelOptions from "../../pages/bpm/data/academicLevel.json";
import { Button, Col, Flex, Form, Input, List, Row, Select, Space } from "antd";
import {
  DeleteFilled,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export default function AcademicDataStep() {
  const [complementaryStudy, setComplementaryStudy] = React.useState([]);
  const [knownSystems, setKnownSystems] = React.useState([]);

  function addStudy(study) {
    setComplementaryStudy([...complementaryStudy, study]);
  }

  function deleteStudy(index) {
    copy = [...complementaryStudy];
    copy.splice(index, 1);
    setComplementaryStudy(copy);
  }

  function addKnownSystem(system) {
    setKnownSystems([...knownSystems, system]);
  }

  function deleteSystem(index) {
    copy = [...knownSystems];
    copy.splice(index, 1);
    setKnownSystems(copy);
  }

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
      <Row gutter={16}>
        <Col
          span={12}
          style={{
            background: "#1677ff",
            padding: "10px 0 10px 20px",
            borderRadius: "10px",
          }}
        >
          Estudios Complementarios
          <Form.Item>
            <Input
              placeholder="inserta un estudio complementario"
              addonAfter={<PlusCircleOutlined style={{color:'green', fontSize:'16px'}}/>}
              type="text"
              style={{background:'white', border: "1px solid white", borderRadius:'5px'}}
              onKeyUp={(e) => {
                e.preventDefault();
                if (e.key == "Enter") addStudy(e.currentTarget.value);
              }}
            />
          </Form.Item>
          <Flex
            vertical
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              width: "99%",
            }}
          >
            <List
              grid={{ column: 1 }}
              style={{ paddingTop: "5px" }}
              size="small"
              itemLayout="horizontal"
              dataSource={complementaryStudy}
              renderItem={(item, index) => (
                <Flex
                  justify="center"
                  align="center"
                  style={{ height: "2rem", margin:'0 8px 8px 0' }}
                >
                  <Input
                    value={item}
                    styles={{
                      input: { height: "2rem", margin: "10px 10px 0 0" },
                    }}
                  />
                  <Button
                    danger
                    onClick={() => deleteStudy(index)}
                    icon={<DeleteFilled />}
                  />
                </Flex>
              )}
            />
          </Flex>
        </Col>
        <Col span={12}>
          <Form.Item>
            <Input placeholder="inserta una título" />
          </Form.Item>
        </Col>
      </Row>
    </Flex>
  );
}
