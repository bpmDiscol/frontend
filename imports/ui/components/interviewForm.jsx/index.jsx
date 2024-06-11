import { Button, Col, Divider, Flex, Form, Row } from "antd";
import React from "react";

import Icon, { UserOutlined } from "@ant-design/icons";
import PersonalDataStep from "./personalDataStep";
import PersonalAnotationsStep from "./personalAnotationsStep";
import AcademicDataStep from "./academicDataStep";

const menuList = [
  {
    label: "Personal",
    title: "Información Personal",
    icon: UserOutlined,
    form: <PersonalDataStep />,
  },
  {
    label: "Anotación",
    title: "Anotaciones Personal/Familiar",
    icon: UserOutlined,
    form: <PersonalAnotationsStep />,
  },
  {
    label: "Académico",
    title: "Formación Académica",
    icon: UserOutlined,
    form: <AcademicDataStep />,
  },
];

export default function InterviewForm({ update, onClose }) {
  const [currentForm, setCurrentForm] = React.useState(1);
  const [formAttempt, setFormAttempt] = React.useState();
  const [form] = Form.useForm();
  const changedFields = {};

  function updateFields(changed) {
    if (
      changed.field != changedFields?.field ||
      changed.value != changedFields?.value
    ) {
      const { field, value } = changed;
      console.log({ field, value });
      changedFields.field = field;
      changedFields.value = value;
    }
  }

  return (
    <Form
      form={form}
      layout="inline"
      requiredMark={false}
      onFinish={(values) => {
        setCurrentForm(formAttempt);
      }}
      onKeyDown={(e) => {
        if (e.key == "Enter") e.preventDefault();
      }}
      labelAlign="left"
      labelCol={{
        span: 8,
        style: { alignItems: "center" },
      }}
      wrapperCol={{
        span: 16,
        style: { padding: "5px 10px" },
      }}
      onFieldsChange={(field) => {
        // updateFields({ field: field[0].name[0], value: field[0].value });
      }}
    >
      <Row gutter={{ xs: 8, lg: 32 }}>
        <Col span={3}>
          <Flex vertical>
            {menuList.map((menuItem, index) => {
              return (
                <Flex key={index} vertical justify="center" align="center">
                  <Button
                    shape="circle"
                    icon={<Icon component={menuItem.icon} />}
                    htmlType="submit"
                    title="Datos personales"
                    onClick={() => setFormAttempt(index)}
                  />
                  <Col
                    xs={0}
                    sm={24}
                    style={{ justifyContent: "center", textAlign: "center" }}
                  >
                    {menuItem.label}
                  </Col>
                </Flex>
              );
            })}
          </Flex>
        </Col>
        <Col span={21}>
          <Row>
            <Col xs={0} sm={24}>
              <Divider>{menuList[currentForm || 0].title}</Divider>
            </Col>
          </Row>
          {menuList[currentForm || 0].form}
        </Col>
      </Row>
    </Form>
  );
}
