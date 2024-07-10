import React from "react";
import calcularTiempoPromedioPorActividad from "./tiempoMedioPorActividad";
import monthNames from "./monthNames.json";

export default function ProcessRequests({ requestProcess, approvations }) {
  const [data, setData] = React.useState();
  console.log("🚀 ~ ProcessRequests ~ data:", data)

  React.useEffect(() => {
    const data = calcularTiempoPromedioPorActividad(
      approvations,
      requestProcess
    );
    const contrataciones = data?.contrataciones;
    if (contrataciones) {
      let areas = [];
      let candidates = [];
      let finales = [];

      const areaList = Object.keys(contrataciones);
      areaList.forEach((area) => {
        areas.push(area);
        const fecha = Object.keys(contrataciones[area]);
        fecha.forEach((fechaStr) => {
          fecha.push(fechaStr);
          candidates.push(contrataciones[area][fechaStr].candidates);
          finales.push(contrataciones[area][fechaStr].final);
        });
      });

      setData({
        areas,
        candidates,
        finales,
      });
    }
  }, [approvations, requestProcess]);

  return <div>{JSON.stringify(approvations)}</div>;
}
