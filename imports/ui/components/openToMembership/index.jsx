import { DotChartOutlined } from "@ant-design/icons";
import { Flex, Progress, Skeleton, Spin } from "antd";
import React from "react";

export default function OpenToMembership({ children, memberships }) {
  const [isVisible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  async function openVisibility() {
    const test = memberships.map((role) => {
      return Meteor.callAsync("is_proccess_auth", role, Meteor.userId());
    });
    await Promise.all(test)
      .then((permissions) => setVisible(permissions.includes(true)))
      .then(() => setLoading(false))
      .catch((error) => {
        console.log(error);
      });
  }
  React.useEffect(() => {
    openVisibility();
  }, []);

  if (loading) return <Spin fullscreen tip="Analizando datos..." />;

  function GraphSqueleton() {
    return (
      <Skeleton.Node style={{ height: "40dvh" }} active={true}>
        <DotChartOutlined
          style={{
            fontSize: 40,
            color: "#bfbfbf",
          }}
        />
      </Skeleton.Node>
    );
  }
  if (!isVisible) return;

  return (
    <Spin
      tip={<Progress percent={"auto"} status="active" showInfo={false} />}
      style={{ width: "80%", height: "20dvh" }}
      indicator={
        <Flex
          justify="center"
          align="center"
          style={{ position: "absolute", top: "2rem" }}
        >
          <Flex>Cargando...</Flex>
        </Flex>
      }
      spinning={loading}
    >
      {!loading ? children : <GraphSqueleton />}
    </Spin>
  );
}
