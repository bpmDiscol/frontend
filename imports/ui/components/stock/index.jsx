import { Button, Flex, Input, Space, Table, Typography } from "antd";
import React from "react";
import AddStack from "./addStack";
import { SearchOutlined } from "@ant-design/icons";
const { Title } = Typography;

export default function Stock() {
  const columns = [
    {
      title: "Producto",
      dataIndex: "product",
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
    },
    {
      title: "Proveedor",
      dataIndex: "provider",
    },
    {
      title: "Descripción",
      dataIndex: "description",
    },
  ];
  return (
    <Table
      title={() => (
        <Flex align="end" justify="space-between">
          <Title level={2}>Inventario</Title>
          <AddStack />
          <Button>Importar productos</Button>
          <Button>Exportar Lista</Button>
          <Space.Compact><Input /><Button icon={<SearchOutlined />} /></Space.Compact>
        </Flex>
      )}
      columns={columns}
      scroll={{
        y: true,
      }}
      style={{ width: "100%", padding: 10 }}
    />
  );
}
