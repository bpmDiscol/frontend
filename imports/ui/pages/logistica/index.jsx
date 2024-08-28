import { Col, Menu, Row } from "antd";
import React, { useState } from "react";
import { getView } from "../../config/getView";

export default function Logistica() {
  const [view, setView] = useState("inventory");
  const menuItems = [
    {
      key: "1",
      label: "Inventario",
      icon: <img src="/icons/IconoirBoxIso.svg" />,
      onClick: () => setView("inventory"),
    },
    {
      key: "2",
      label: "Proveedores",
      icon: <img src="/icons/MdiTruckCheck.svg" />,
      onClick: () => setView("providers"),
    },
    {
      key: "3",
      label: "Requisición",
      icon: <img src="/icons/boxPlus.svg" />,
      onClick: () => setView("logisticRequest"),
    },
  ];
  return (
    <Row
      style={{
        height: "80dvh",
        width: "95%",
        backgroundColor: "white",
        borderRadius: "10px",
      }}
    >
      <Col span={4}>
        <Menu items={menuItems} style={{ height: "80dvh" }} />
      </Col>
      <Col span={20}>{getView(view)}</Col>
    </Row>
  );
}
