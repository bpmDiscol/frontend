import React, { useState } from "react";
import BPMEditor from "../../../components/editor";
import { Button, Flex, Input, message } from "antd";

import OpenToMembership from "../../../components/openToMembership";
import { getCase } from "../../../config/taskManagement";
import { CheckOutlined } from "@ant-design/icons";

export default function PositionSalary({
  concept,
  setConcept,
  requestEmployee,
}) {
  const [salary, setSalary] = useState("");
  const [helper, setHelper] = useState(requestEmployee?.salary);
  async function saveSalary() {
    if(!salary) return message.warning('Debes introducir un valor')
    const isUpdated = await Meteor.callAsync(
      "update_salary",
      getCase(),
      parseInt(salary)
    ).catch(() => {
      message.error("Error actualizando el salario");
    });
    if (isUpdated) {
      message.success("Salario actualizado");
      setSalary("");
      setHelper(salary);
    }
  }
  return (
    <div>
      <OpenToMembership
        memberships={[
          ["director", "discol"],
          ["director", "Proyectos_SCR"],
          ["director", "Direccion_Administrativa"],
          ["director", "Cartera"],
        ]}
      >
        <Flex style={{ width: "25dvw" }}>
          <Input
            prefix="¿Corregir salario? "
            placeholder={helper}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            onPressEnter={(e) => {
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
