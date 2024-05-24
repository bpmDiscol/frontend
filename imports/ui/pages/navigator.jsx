import React from "react";
import "./styles/navigator.css";
import { MainViewContext } from "../context/mainViewProvider";
import { safeLogOut } from "../misc/userStatus";

export default function Navigator() {
  const { setView } = React.useContext(MainViewContext);

  return (
    <div className="navigator">
      <img src="/logo.png" />
      <div>
        <button onClick={() => setView('dashboard')}>Dashboard</button>
        <button onClick={() => setView('process')}>Procesos</button>
        <button onClick={() => setView('tasks')}>Pendientes</button>
      </div>
      <button onClick={() => safeLogOut()}>cerrar sesion</button>
    </div>
  );
}
