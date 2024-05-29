import { Button, Card, Flex, Input, List, Space, Typography } from "antd";
import React from "react";
import { DeleteFilled, PlusCircleFilled } from "@ant-design/icons";
const { Title } = Typography;
export default function AddOtherGears({ update, requestData }) {
  const [otherGears, setOtherGears] = React.useState([]);
  const [newItem, setNewItem] = React.useState("");

  React.useEffect(() => {
    setOtherGears(requestData?.gears?.other);
    update("gears.other", []);
    update("gears.isOther", false);
  }, []);

  function addItem() {
    if (newItem) {
      setOtherGears([...otherGears, newItem]);
      update("gears.other", [...otherGears, newItem]);
      update("gears.isOther", true);
    }
  }

  function deleteGear(index) {
    copyGears = [...otherGears];
    copyGears.splice(index, 1);
    setOtherGears(copyGears);
    update("gears.other", copyGears);
    if (copyGears.length == 0) update("gears.isOther", false);
  }
  return (
    <Flex
      vertical
      style={{
        width: "40%",
        padding: "10px 10px 10px 40px",
        background: "lightblue",
        borderRadius: "10px",
      }}
      justify="center"
    >
      <Title level={5}>¿Equipo adicional?</Title>
      <Space.Compact style={{ margin: "10px 0", width: "90%" }}>
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.currentTarget.value)}
          onKeyUp={(e) => {
            if (e.key == "Enter") addItem();
          }}
        />
        <Button
          style={{
            background: "#1677ff",
            color: "whitesmoke",
            border: "1px solid blue",
          }}
          onClick={addItem}
          icon={<PlusCircleFilled />}
        />
      </Space.Compact>
      <Flex
        vertical
        style={{ overflowY: "scroll", overflowX: "hidden", height: "30lvh" }}
      >
        <List
          grid={{ column: 1 }}
          style={{ paddingTop: "5px" }}
          size="small"
          itemLayout="horizontal"
          dataSource={otherGears}
          renderItem={(item, index) => (
            <List.Item
              style={{
                backgroundColor: "white",
                padding: "5px 10px",
                borderRadius: "10px",
                width: "95%",
              }}
            >
              <Flex justify="space-between" align="center">
                {item}{" "}
                <Button
                  onClick={() => deleteGear(index)}
                  icon={<DeleteFilled />}
                />
              </Flex>
            </List.Item>
          )}
        />
      </Flex>
    </Flex>
  );
}
