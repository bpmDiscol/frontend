import React from "react";
import { Collapse } from "antd";

export default function PositionObservations({ requestEmployee }) {
  const [accordeonData, setAcordeonData] = React.useState([]);

  const accordeonTitles = [
    "Nota del lider",
    "Nota de Director Administrativo",
    "Nota de Recursos Humanos",
    "Carga de curricullums",
    "Entrevista",
    "Antecedestes",
    "Lider -REvision de curricullums -",
    "Inicio de contratación",
    "REvision de resultados médicos",
  ];

  function adaptAcordeonData() {
    const accordeonAdapted = requestEmployee.observations.map((data, index) => {
      return {
        key: index,
        label: accordeonTitles[index],
        children: <div dangerouslySetInnerHTML={{ __html: data }} />,
      };
    });
    setAcordeonData(accordeonAdapted);
  }

  React.useEffect(() => {
    adaptAcordeonData();
  }, []);

  return (
    <div className="observations">
      {accordeonData && (
        <Collapse
          items={accordeonData}
          defaultActiveKey={accordeonData.length}
          size="small"
        />
      )}
   
    </div>
  );
}
