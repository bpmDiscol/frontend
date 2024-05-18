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
import { MainViewContext } from "../../../context/mainViewProvider";

import { Button, Flex, Segmented } from "antd";
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  DislikeFilled,
} from "@ant-design/icons";

export default function EmployeeRequestAdm() {
  const [requestEmployeeData, setRequestEmployeeData] = React.useState();
  const [requestEmployee, setRequestEmployee] = React.useState();
  const { setView } = React.useContext(MainViewContext);
  const [tabView, setTabView] = React.useState();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    Meteor.callAsync("get_employee_request").then((response) => {
      setRequestEmployee(response);
      console.log(response);
      Meteor.call(
        "request_data_links",
        {
          requestLinks: response.links,
        },
        (error, response) => {
          if (!error) {
            console.log(response);
            setRequestEmployeeData(response);
          }
        }
      );
    });
  }, []);

  React.useEffect(() => {
    requestEmployee && requestEmployeeData && setLoaded(true);
  }, [requestEmployee, requestEmployeeData]);

  React.useEffect(() => {
    loaded && setTabView(<LoadPage Component={tabContents[0]} />);
  }, [loaded]);
  function LoadPage({ Component }) {
    return (
      <div>
        <Component
          requestEmployee={requestEmployee}
          requestEmployeeData={requestEmployeeData}
        />
      </div>
    );
  }
  const tabTitles = [
    { label: "Datos del cargo", value: 0 },
    { label: "Vehiculo", value: 1 },
    { label: "Requerimientos", value: 2 },
    { label: "Equipo necesario", value: 3 },
    { label: "Observaciones", value: 4 },
  ];
  const tabContents = [
    PositionGereralities,
    PositionVehicle,
    PositionRequirements,
    PositionGears,
    PositionObservations,
  ];

  return (
    <div className="main-container">
      <Flex vertical justify="center" align="center">
        <Flex align="center" vertical>
          <h1>Solicitud de empleado</h1>
          <h3>concepto administrativo</h3>
        </Flex>
        <div className="tabs.segment">
          <Segmented
            options={tabTitles}
            onChange={(value) =>
              setTabView(<LoadPage Component={tabContents[value]} />)
            }
            defaultValue={0}
          />
        </div>
        <div className="tabs-container">
          {requestEmployee && requestEmployeeData && <Flex>{tabView}</Flex>}
        </div>
      </Flex>
      <span className="horizontal-buttons">
        <Button
          type="primary"
          onClick={() => setView("tasks")}
          icon={<RotateLeftOutlined />}
        >
          Regresar
        </Button>
        <Button
          type="primary"
          onClick={() => alert("rechaado")}
          icon={<DislikeFilled />}
        >
          Rechazar
        </Button>
        <Button
          type="primary"
          onClick={() => alert("continuar")}
          icon={<RotateRightOutlined />}
          iconPosition="end"
        >
          Continuar
        </Button>
      </span>
    </div>
  );
}
