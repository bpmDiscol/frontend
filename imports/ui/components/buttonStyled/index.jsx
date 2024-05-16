import React from "react";
import "./button.css";
export default function ButtonStyled(props) {
  return (
    <button className="button-styled" {...props}>
      <img className="button-icon" src={props.icon} />
      <span className="button-label">{props.children}</span>
    </button>
  );
}
