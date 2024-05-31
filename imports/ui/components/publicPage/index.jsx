import React from "react";
import { Layout } from "antd";
import PublicHeader from "./publicHeader";
const { Header, Footer, Sider, Content } = Layout;

export default function PublicPage() {
  return (
    <Layout>
      <Header style={{ background: "#001b74", width: "100%" }}>
        <PublicHeader />
      </Header>
      <Content></Content>
      <Sider></Sider>
    </Layout>
  );
}