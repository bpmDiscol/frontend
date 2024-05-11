import React from "react";
import { Meteor } from "meteor/meteor";
import "./styles/navigator.css";
import { MainViewContext } from "../context/mainViewProvider";

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
      <button onClick={() => Meteor.logout()}>cerrar sesion</button>
    </div>
  );
}
