import React from "react";
import "../styles.css";

export default function EmployeeRequestPreview() {
  const [requestEmployeeData, setRequestEmployeeData] = React.useState();

  React.useEffect(() => {
    Meteor.callAsync("get_employee_request").then((response) =>
      setRequestEmployeeData(response)
    );
  }, []);

  return (
    <div className="preview-container">
      <img className="preview-image" src="/personal_file.svg" />
      <span className="preview-data">
        {requestEmployeeData && (
          <div className="row">
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
          </div>
        )}
      </span>
    </div>
  );
}
