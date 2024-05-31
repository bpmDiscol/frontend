import React from 'react'
import { Layout } from "antd";
const { Header, Footer, Sider, Content } = Layout;

export default function index() {
  return (
    <Layout>
        <Header></Header>
        <Content></Content>
        <Sider></Sider>
    </Layout>
  )
}
