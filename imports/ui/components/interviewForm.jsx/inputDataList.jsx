import { DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, List } from "antd";
import React from "react";

export default function InputDataList({
  title,
  placeholder,
}) {
  const [dataSource, setDataSource] = React.useState([]);

  function addItem(item) {
    setDataSource([...dataSource, item]);
  }

  function deleteItem(index) {
    copy = [...dataSource];
    copy.splice(index, 1);
    setDataSource(copy);
  }

  return (
    <div>
      <h3>{title}</h3>
      <Form.Item>
        <Input
          placeholder={placeholder}
          addonAfter={
            <PlusCircleOutlined style={{ color: "green", fontSize: "16px" }} />
          }
          type="text"
          style={{
            background: "white",
            border: "1px solid white",
            borderRadius: "5px",
          }}
          onKeyUp={(e) => {
            e.preventDefault();
            if (e.key == "Enter") addItem(e.currentTarget.value);
          }}
        />
      </Form.Item>
      <Flex
        vertical
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          width: "99%",
        }}
      >
        <List
          grid={{ column: 1 }}
          style={{ paddingTop: "5px" }}
          size="small"
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={(item, index) => (
            <Flex
              justify="center"
              align="center"
              style={{ height: "2rem", margin: "0 8px 8px 0" }}
            >
              <Input
                value={item}
                styles={{
                  input: { height: "2rem", margin: "10px 10px 0 0" },
                }}
              />
              <Button
                danger
                onClick={() => deleteItem(index)}
                icon={<DeleteFilled />}
              />
            </Flex>
          )}
        />
      </Flex>
    </div>
  );
}
