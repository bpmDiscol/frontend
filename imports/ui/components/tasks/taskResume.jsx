import React from "react";

export default function TaskResume() {
  const [requestEmployeeData, setRequestEmployeeData] = React.useState();

  React.useEffect(() => {
    Meteor.callAsync("get_employee_request").then((response) => {
      if (response) setRequestEmployeeData(response);
    });
  }, []);

  return (
    <div>
      {requestEmployeeData && (
        <>
          <p>
            <strong>Cargo: </strong>
            {requestEmployeeData.companyPosition}
          </p>
          <p>
            <strong>Sede: </strong>
            {requestEmployeeData.site}
          </p>
          <p>
            <strong>Area/proyecto: </strong>
            {requestEmployeeData.area_proyect}
          </p>
          <p>
            <strong>Lugar de trabajo: </strong>
            {requestEmployeeData.workPlace}
          </p>

          <p>
            <strong>Salario: </strong>
            {requestEmployeeData.salary}
          </p>
          <p>
            <strong>Cantidad de vacantes: </strong>
            {requestEmployeeData.vacancies}
          </p>
        </>
      )}
    </div>
  );
}