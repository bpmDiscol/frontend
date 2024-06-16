import React from "react";
import { Button, Col, Flex, Row } from "antd";

import "./styles/workshop.css";

//components
import Header from "../components/header";
import Navigator from "../components/navigator";

import { MainViewContext } from "../context/mainViewProvider";
import { RightOutlined } from "@ant-design/icons";

export default function Workshop() {
  const { view } = React.useContext(MainViewContext);
  const [openNav, setOpenNav] = React.useState(true);

  return (
    <Flex
      vertical
      style={{ height: "100vh", width: "100vw", overflow: "hidden" }}
    >
      {/* Header */}
      <Header />
      {/* Body */}
      <Flex  style={{ height: "calc(100lvh - 40px)" }}>
        {/* Drawer */}
        <Flex
          vertical
          style={{
            width: openNav ? "200px" : "20px",
            transition: "all 300ms ease-in-out",
            background:'#f6f6f6',
            borderRight:'1px solid #e6e6ef',
            
          }}
          id="navigator-menu"
        >
          <Flex justify={"end"} style={{ width: "100%" }}>
            <Button
              style={{
                position: "relative",
                right: "-15px",
                top: "30px",
                width: "10px",
                zIndex: 2,
              }}
              shape="circle"
              onClick={() => setOpenNav(!openNav)}
              icon={<RightOutlined rotate={openNav ? 180 : 0} />}
            />
          </Flex>
          <div
            style={{
              display: openNav ? "block" : "none",
              animation: openNav
                ? "appear ease-in 300ms"
                : "hidde linear 300ms",
            }}
          >
            <Navigator />
          </div>
        </Flex>
        {/* Main view */}
        <Flex id="main-view" style={{ flex: 1, overflow: "auto" }}>
          {view}
        </Flex>
      </Flex>
    </Flex>
  );
}
