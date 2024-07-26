import React from "react";
import LeaderStep from "./leaderStep";
import { Form } from "antd";

export default function LeaderInterview({ fileId, updateData, background }) {
  const [form] = Form.useForm();
  form.setFieldsValue(background);

  const changedFields = {};
  function updateFields(changed) {
    if (
      changed.field != changedFields?.field ||
      changed.value != changedFields?.value
    ) {
      const { field, value } = changed;
      updateData(`${fileId}.${field}`, value || false);
      changedFields.field = field;
      changedFields.value = value;
    }
  }

  return (
    <Form
      form={form}
      layout="inline"
      requiredMark={false}
      labelWrap
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
          value: field[0].value,
        });
      }}
    >
      <LeaderStep />
    </Form>
  );
}
