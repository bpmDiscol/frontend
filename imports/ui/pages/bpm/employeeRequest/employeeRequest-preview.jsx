import React from "react";
import "../styles.css";

export default function EmployeeRequestPreview({ taskId }) {
  const [requestEmployeeData, setRequestEmployeeData] = React.useState();

  React.useEffect(() => {
    if (taskId)
      Meteor.callAsync("get_employee_request_data", { taskId }).then(
        (response) => setRequestEmployeeData(response)
      );
    else console.log("no task id");
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
