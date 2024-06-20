import { Button, Col, Divider, Flex, Form, Row, Spin } from "antd";
import React from "react";

import Icon, { SafetyCertificateFilled, UserOutlined } from "@ant-design/icons";
import PersonalDataStep from "./personalDataStep";
import PersonalAnotationsStep from "./personalAnotationsStep";
import AcademicDataStep from "./academicDataStep";
import LaboralDataStep from "./laboralDataStep";
import MovilityStep from "./movilityStep";
import CompetencesStep from "./competencesStep";
import LeaderStep from "./leaderStep";
import FinalConceptStep from "./finalConceptStep";

const menuList = [
  {
    label: "Personal",
    id: "personal",
    title: "Información Personal",
    icon: UserOutlined,
    form: PersonalDataStep,
  },
  {
    label: "Anotación",
    id: "anotation",
    title: "Anotaciones Personal/Familiar",
    icon: UserOutlined,
    form: PersonalAnotationsStep,
  },
  {
    label: "Académico",
    id: "academic",
    title: "Formación Académica",
    icon: UserOutlined,
    form: AcademicDataStep,
  },
  {
    label: "Laboral",
    id: "laboral",
    title: "Experiencia laboral",
    icon: UserOutlined,
    form: LaboralDataStep,
  },
  {
    label: "Movilidad",
    id: "movility",
    title: "Movilidad",
    icon: UserOutlined,
    form: MovilityStep,
  },
  {
    label: "Competencias",
    id: "competences",
    title: "Evaluación de competencias",
    icon: UserOutlined,
    form: CompetencesStep,
  },
  {
    label: "Lider",
    id: "leader",
    title: "Evaluación del lider de area/proyecto",
    icon: UserOutlined,
    form: LeaderStep,
  },
  {
    label: "Concepto",
    id: "final-concept",
    title: "Concepto final",
    icon: UserOutlined,
    form: FinalConceptStep,
  },
];

export default function InterviewForm({ onClose, fileId }) {
  const [currentForm, setCurrentForm] = React.useState(0);
  const [formAttempt, setFormAttempt] = React.useState();
  const [taskId, setTaskId] = React.useState();
  const [form] = Form.useForm();

  async function update(field, value) {
    await Meteor.callAsync("update_task", { taskId, field, value }).catch(error=> console.error(error));
  }

  React.useEffect(() => {
      const taskId = "employeeInterview-" + sessionStorage.getItem("constId");
      setTaskId(taskId);
      Meteor.call("get_task_data", taskId, (err, resp) => {
        if (!err) {
          form.setFieldsValue(resp[0][`interview-${fileId}`]);
          setCurrentForm(resp[0][`interview-${fileId}`]?.currentForm || 0);
        }
      });
    
  }, []);

  const changedFields = {};
  function updateFields(changed) {
    if (
      changed.field != changedFields?.field ||
      changed.value != changedFields?.value
    ) {
      const { field, value } = changed;
      update(`interview-${fileId}.${field}`, value || false);
      changedFields.field = field;
      changedFields.value = value;
    }
  }

  const FormElement = (Component) => {
    return <Component update={updateFields} form={form} />;
  };

  return (
    <Form
      form={form}
      layout="inline"
      requiredMark={false}
      labelWrap
      onFinish={() => {
        setCurrentForm(formAttempt);
        updateFields({ field: "currentForm", value: formAttempt || 0 });
      }}
      onKeyDown={(e) => {
        if (e.key == "Enter") {
          e.preventDefault();
        }
      }}
      labelAlign="left"
      labelCol={{
        span: 8,
        style: { alignItems: "center" },
      }}
      wrapperCol={{
        span: 16,
        style: { padding: "15px 10px" },
      }}
      onFieldsChange={(field) => {
        updateFields({
          field: field[0].name[0],
          value: form.getFieldValue(field[0].name[0]),
        });
      }}
    >
      <Row gutter={{ xs: 8, lg: 32 }}>
        <Col span={3}>
          <Flex vertical gap={10}>
            {menuList.map((menuItem, index) => {
              return (
                <Flex key={index} vertical justify="center" align="center">
                  <Button
                    id={menuItem.id}
                    shape="circle"
                    icon={
                      <Icon
                        component={menuItem.icon}
                        style={{
                          color: currentForm == index ? "white" : "#2271b1",
                          fontSize: "20px",
                        }}
                      />
                    }
                    htmlType="submit"
                    title={menuItem.title}
                    onClick={() => setFormAttempt(index)}
                    size="large"
                    style={{
                      background: currentForm == index ? "#2271b1" : "white",
                    }}
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
            <Flex vertical justify="center" align="center">
              <Button
                id="save"
                shape="circle"
                icon={
                  <SafetyCertificateFilled
                    style={{ color: "green", fontSize: "20px" }}
                  />
                }
                title={"Guardar"}
                htmlType="submit"
                onClick={() => {
                  setFormAttempt(currentForm);
                  onClose(false);
                }}
                size="large"
              />
              <Col
                xs={0}
                sm={24}
                style={{ justifyContent: "center", textAlign: "center" }}
              >
                Guardar
              </Col>
            </Flex>
          </Flex>
        </Col>
        <Col span={21}>
          <Row>
            <Col span={24}>
              <Divider>{menuList[currentForm || 0].title}</Divider>
            </Col>
          </Row>
          {FormElement(menuList[currentForm || 0].form)}
        </Col>
      </Row>
    </Form>
  );
}
