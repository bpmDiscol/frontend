import { DeleteFilled, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, List } from "antd";
import React from "react";

export default function InputDataList({ title, placeholder, id }) {
  const [dataSource, setDataSource] = React.useState([]);
  const [currentValue, setCurrentValue] = React.useState("");

  function addItem() {
    if (currentValue) {
      setDataSource([...dataSource, currentValue]);
      setCurrentValue("");
    }
  }

  function deleteItem(index) {
    copy = [...dataSource];
    copy.splice(index, 1);
    setDataSource(copy);
  }

  return (
    <div>
      <h3 style={{ color: "white" }}>{title}</h3>
      <Form.Item>
        <Input
          id={`input-${id}`}
          placeholder={placeholder}
          addonAfter={
            <PlusCircleOutlined
              style={{ color: "green", fontSize: "16px", cursor: "pointer" }}
              onClick={() => addItem()}
            />
          }
          type="text"
          style={{
            background: "white",
            border: "1px solid white",
            borderRadius: "5px",
            width:'15rem',
            margin:0
          }}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          onKeyUp={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.key == "Enter") addItem();
          }}
        />
      </Form.Item>
      <Flex
        vertical
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          width: "99%",
          minHeight:'170px'
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
                id={`button-delete-${id}-${index}`}
              />
            </Flex>
          )}
        />
      </Flex>
    </div>
  );
}
