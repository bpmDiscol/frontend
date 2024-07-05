import React from "react";
import { Collapse, Flex, Result } from "antd";

export default function PositionObservations({ requestEmployee }) {
  const [accordeonData, setAcordeonData] = React.useState([]);

  const accordeonTitles = [
    "Nota del lider",
    "Nota de Director Administrativo",
    "Nota de Recursos Humanos",
    "Carga de curricullums",
    "Entrevista",
    "Antecedestes",
    "Lider -Revision de curricullums -",
    "Inicio de contratación",
    "Revision de resultados médicos",
  ];

  function adaptAcordeonData() {
    const accordeonAdapted = requestEmployee?.observations?.map((data, index) => {
      return {
        key: index,
        label: accordeonTitles[index],
        children: <div dangerouslySetInnerHTML={{ __html: data }} />,
        style: {
          background: "lightgray",
          borderWidth: "1px",
          borderRadius: "5px",
        },
      };
    });
    setAcordeonData(accordeonAdapted);
  }

  React.useEffect(() => {
    adaptAcordeonData();
  }, []);

  return (
    <Flex style={{ width: "100%" }} justify="center">
      {accordeonData?.length > 0 ? (
        <Collapse
          accordion
          style={{ width: "100%" }}
          items={accordeonData}
          defaultActiveKey={accordeonData.length}
          size="small"
        />
      ) : (
        <Result title="Sin observaciones hasta el momento" status={"info"} />
      )}
    </Flex>
  );
}
