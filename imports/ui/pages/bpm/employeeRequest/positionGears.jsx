import { List } from "antd";
import React from "react";

export default function PositionGears({ requestEmployeeData }) {
  const listItems = [
    {
      label: "Computador de escritorio",
      value: "isDesktopPC",
    },
    {
      label: "Computador portatil",
      value: "isLaptop",
    },
    {
      label: "Monitor de computador",
      value: "isScreen",
    },
    {
      label: "Teclado",
      value: "isKeyboard",
    },
    {
      label: "Ratón",
      value: "isMouse",
    },
    {
      label: "Correo electrónico corporativo",
      value: "isEmail",
    },
    {
      label: "Escritorio",
      value: "isDesk",
    },
    {
      label: "Silla",
      value: "isChair",
    },
  ];

  function ListItems() {
    const presentItems = listItems
      .filter((item) => requestEmployeeData.gears[item.value])
      .map((item) => {
        return { title: item.label };
      });

    const otherItems = requestEmployeeData.gears.other.map((item) => {
      return { title: item };
    });

    return presentItems.concat(otherItems);
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={ListItems()}
      renderItem={(item) => <List.Item style={{background: "red"}}>{item.title}</List.Item>}
    />
    // <div className="center-container">
    //   <div className="half-container">
    //     <ul style={{listStyle:'square'}}>
    //       <ListItems />
    //       <OtherItems />
    //     </ul>
    //   </div>
    // </div>
  );
}
