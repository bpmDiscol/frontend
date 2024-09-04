import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import BPMEditor from "../../../components/editor";
import { Button, Flex, Input, message } from "antd";
import OpenToMembership from "../../../components/openToMembership";
import { getCase } from "../../../config/taskManagement";
import { CheckOutlined, SearchOutlined } from "@ant-design/icons";

export default function PositionSalary({
  concept,
  setConcept,
  requestEmployee,
}) {
  const [salary, setSalary] = useState("");
  async function saveSalary() {
    await Meteor.callAsync("update_salary", getCase(), parseInt(salary)).catch(
      () => message.error("Error actualizando el salario")
    );
    message.success("Salario actualizado");
    setSalary("");
  }
  return (
    <div>
      <OpenToMembership
        memberships={[
          ["director", "discol"],
          ["director", "Proyectos_SCR"],
        ]}
      >
        <Flex style={{ width: "25dvw", justifyContent: "space-between" }}>
          <Input
            prefix="¿Corregir salario? "
            placeholder={requestEmployee?.salary}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveSalary();
            }}
            suffix={
              <Button
                shape="circle"
                icon={<CheckOutlined />}
                onClick={() => saveSalary()}
              />
            }
          />
        </Flex>
      </OpenToMembership>
      <BPMEditor requestData={concept} field={"local"} update={setConcept} />
    </div>
  );
}
