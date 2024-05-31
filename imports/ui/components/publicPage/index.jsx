import React from "react";
import { Layout } from "antd";
import PublicHeader from "./publicHeader";
const { Header, Footer, Sider, Content } = Layout;

export default function PublicPage() {
  return (
    <Layout>
      <Header style={{ background: "#fff", width: "100%", padding: 0}}>
        <PublicHeader />
      </Header>
      <Content></Content>
      <Sider></Sider>
    </Layout>
  );
}
