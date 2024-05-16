import React from "react";
import TabNavigator from "../../../components/tabNavigator";
import ButtonStyled from "../../../components/buttonStyled";
import PositionGereralities from "./positionGereralities";
import PositionSalary from "./positionSalary";
import PositionVehicle from "./positionVehicle";
import PositionContractType from "./positionContractType";
import PositionRequirements from "./positionRequirements";
import PositionGears from "./positionGears";
import PositionObservations from "./positionObservations";

export default function EmployeeRequestAdm({ taskId }) {
  const [currentTaskId, setCurrentTaskId] = React.useState();

  React.useEffect(() => {
    const taskID = sessionStorage.getItem("temporal-task-id");
    if (taskID) {
      setCurrentTaskId(taskID);
      sessionStorage.setItem("temporal-task-id", taskID);
    }
    // else goback to kanban
  }, []);

  //   React.useEffect(() => {
  //     if (taskId)
  //       Meteor.callAsync("get_employee_request_data", { taskId }).then(
  //         (response) => setRequestEmployeeData(response)
  //       );
  //     else console.log("no task id");
  //   }, []);

  return (
    <div className="main-container">
      <span className="horizontal-block">
        <div>
          <ButtonStyled onClick={() => alert("continuar")} icon="/back.svg">
            Regresar
          </ButtonStyled>
        </div>
      </span>

      <div className="center-container">
        <div className="titles">
          <h1>Solicitud de empleado</h1>
          <h3>concepto administrativo</h3>
        </div>
        <TabNavigator>
          <div title="Datos del cargo">
            <PositionGereralities />
          </div>
          <div title="Salario">
            <PositionSalary />
          </div>
          <div title="Vehiculo">
            <PositionVehicle />
          </div>
          <div title="Tipo de contrado">
            <PositionContractType />
          </div>
          <div title="Requerimientos">
            <PositionRequirements />
          </div>
          <div title="Equipo necesario">
            <PositionGears />
          </div>
          <div title="Observaciones">
            <PositionObservations />
          </div>
        </TabNavigator>
      </div>
      <span className="horizontal-buttons">
        <ButtonStyled onClick={() => alert("rechaado")} icon="/close.svg">
          Rechazar
        </ButtonStyled>
        <ButtonStyled onClick={() => alert("continuar")} icon="/accept.svg">
          Continuar
        </ButtonStyled>
      </span>
    </div>
  );
}
