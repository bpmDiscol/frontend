import React from "react";

import "../styles/workshop.css";

//components
import Header from "../components/header";
import { MainViewContext } from "../context/mainViewProvider";
import Navigator from "../components/navigator";

export default function Workshop() {
  const { view } = React.useContext(MainViewContext);

  return (
    <div id="workshop" className="workshop">
      <header>
        <Header />
      </header>
      <nav>
        <Navigator />
      </nav>
      <main>{view}</main>
    </div>
  );
}
