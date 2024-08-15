import { Form, Radio } from "antd";
import React from "react";

export default function StatusButton({
  targetField,
  currentBackground,
  setCurrentBackground,
}) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      onFieldsChange={(field) =>
        setCurrentBackground(field[0].value, targetField)
      }
      labelCol={{
        span: 10,
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
      wrapperCol={{
        span: 32,
        style: { padding: "15px 10px" },
      }}
      requiredMark={false}
      layout="inline"
      labelWrap
      labelAlign="left"
    >
      {currentBackground && (
        <Form.Item
          name={"status"}
          label={"Estatus del candidato"}
          initialValue={currentBackground.status}
          rules={[
            {
              required: true,
            },
          ]}
          hasFeedback
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="approved">Aprobado</Radio.Button>
            <Radio.Button value="rejected">Rechazado</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}
    </Form>
  );
}
