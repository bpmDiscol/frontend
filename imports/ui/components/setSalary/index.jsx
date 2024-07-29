import React from "react";
import { useTracker } from "meteor/react-meteor-data";

import { getCase } from "../../config/taskManagement";
import { requestEmployeeCollection } from "../../../api/requestEmployeData/requestEmployeeDataPublication";
import { Form, Input } from "antd";

export default function SetSalary({ member }) {
  const [form] = Form.useForm();
  function setToCurrency(value = 0) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  function setToNumber(value) {
    let numericValue = value.replace(/[\s$\.]/g,  "");
    numericValue = numericValue.replace(",", ".");
    return parseFloat(numericValue);
  }

  const salary = useTracker(() => {
    Meteor.subscribe("requestEmployee");
    const data = requestEmployeeCollection.findOne({ caseId: getCase() });
    const interview = data.interviewInput.filter(
      (interview) => interview.interviewId == member.interviewId
    )[0];
    if (interview.salary) return setToCurrency(interview.salary);
    return setToCurrency(data.requestEmployeeDataInput.salary);
  });

  React.useEffect(() => {
    form.setFieldValue("salary", salary);
  }, [salary]);

  return (
    salary && (
      <Form
        form={form}
        onFieldsChange={(field) => {
          Meteor.callAsync(
            "add_salary",
            setToNumber(field[0].value),
            getCase(),
            member.interviewId
          );
        }}
      >
        <Form.Item name={"salary"} label="Salario definitivo" >
          <Input />
        </Form.Item>
      </Form>
    )
  );
}
