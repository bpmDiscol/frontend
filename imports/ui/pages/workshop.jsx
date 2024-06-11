import React from "react";

import "../styles/workshop.css";

//components
import Header from "../components/header";
import { MainViewContext } from "../context/mainViewProvider";
import Navigator from "../components/navigator";
import { Col, Flex, Row } from "antd";
import { MenuOutlined } from "@ant-design/icons";

export default function Workshop() {
  const { view } = React.useContext(MainViewContext);

  return (
    <Flex vertical style={{overflow:'hidden'}}>
      <Header />
      <Row gutter={32} style={{overflow:'auto'}}>
        <Col xs={0} sm={4}>
          <Navigator />
        </Col>
        <Col xs={24} sm={20}>
          {view}
        </Col>
      </Row>
    </Flex>
  );
}
