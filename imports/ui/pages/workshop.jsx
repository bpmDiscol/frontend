import React from "react";
import { Meteor } from "meteor/meteor";
import "./styles/workshop.css";
import Navigator from "./navigator";
import { MainViewContext } from "../context/mainViewProvider";
import Header from "./header";

export default function Workshop() {
  const { view, userName } = React.useContext(MainViewContext);

  return (
    <div className="workshop">
      <header>
        <Header username={userName} />
      </header>
      <nav>
        <Navigator />
      </nav>
      <main>{view}</main>
      <footer></footer>
    </div>
  );
}
