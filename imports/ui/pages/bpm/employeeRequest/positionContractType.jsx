import React from "react";
import ItemBox from "../../../components/itemBox";

export default function PositionContractType({
  requestEmployee,
  requestEmployeeData,
}) {
  function getContractTypeString(motives) {
    if (motives.isContractedLabor) return "Obra/Labor";
    if (motives.isUndefined) return "Termino indefinido";
    if (motives.isFixedTerm) return "Termino fijo";
    if (motives.isLearning) return "Aprendizaje";
    return "ERROR: Tipo no encontrado";
  }

  function getWorkingDayString(motives) {
    if (motives.isFullTime) return "Tiempo completo";
    if (motives.isPartTime) return "Medio tiempo";
    if (motives.isDayTime) return "Por dias";
    return "ERROR: Jornada no encontrado";
  }

  return (
    <div className="center-container">
      <div className="half-container">
        <ItemBox title={"Salario asignable"} value={requestEmployee.salary} />
        <ItemBox
          title={"Bono"}
          value={
            requestEmployee.isBonus
              ? `${requestEmployeeData.bonusesFrecuency.cuantity} ${requestEmployeeData.bonusesFrecuency.timePart}`
              : "No bono"
          }
        />
        <ItemBox
          title={"Tipo de contrato"}
          value={getContractTypeString(requestEmployeeData.contractType)}
        />
        <ItemBox
          title={"Jornada laboral"}
          value={getWorkingDayString(requestEmployeeData.workingDay)}
        />
        <ItemBox
          title={"Dentro del manual de funciones"}
          value={requestEmployee.isHandbookFunction ? "SI" : "NO"}
        />
      </div>
    </div>
  );
}
