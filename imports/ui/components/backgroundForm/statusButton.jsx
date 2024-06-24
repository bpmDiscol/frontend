import { Form, Radio } from "antd";
import React from "react";

export default function StatusButton({
  id,
  targetField,
  currentBackground,
  setCurrentBackground,
  taskId,
}) {
  const [form] = Form.useForm();
  React.useEffect(() => {
    if (currentBackground?.status == 'rejected') setNewBackground("rejected");
  }, [currentBackground]);
  console.log("🚀 ~ React.useEffect ~ currentBackground:", currentBackground);

  function setNewBackground(value) {
    const newBg = Object.assign(currentBackground || {}, {
      [`${targetField}`]: value,
    });
    setCurrentBackground(newBg);
    Meteor.callAsync("update_backgrounds", {
      taskId,
      id,
      backgroundFiles: newBg,
    }).catch((error) => console.log(error));
  }

  return (
    <Form
      form={form}
      onFieldsChange={(field) => setNewBackground(field[0].value)}
    >
      <Form.Item
        name={"status"}
        label="Estatus del candidato"
        initialValue={"rejected"}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Radio.Group buttonStyle="solid">
          <Radio.Button value="approved">Aprobado</Radio.Button>
          <Radio.Button value="rejected">Rechazado</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
}
