import React from "react";

export default function ItemBox({ title, value }) {
  return (
    <div className="inline-box">
      <strong>{`${title}: `} </strong>
      <input defaultValue={value} readOnly />
    </div>
  );
}
