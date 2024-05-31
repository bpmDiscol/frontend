import { Button, Flex, Image } from "antd";
import React from "react";
import Modal from "react-responsive-modal";
import Login from "../../pages/login";
import "react-responsive-modal/styles.css";
import { GlobalOutlined, UserOutlined } from "@ant-design/icons";

export default function PublicHeader() {
  const [openLogin, setOpenLogin] = React.useState(false);
  const onOpenModal = () => setOpenLogin(true);
  const onCloseModal = () => setOpenLogin(false);

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        height: "6vh",
        width: "100%",
      }}
    >
      <Flex style={{ background: "#0a38d1", padding: "20px 10px" }}>
        <Image src="/logo.png" style={{ width: "8vw", padding:'10px' }} />
      </Flex>
      <Flex style={{ paddingRight: "20px", fontSize: "16px" }} gap={10}>
        <Button
          style={{ color: "#017db2", fontWeight: "bold" }}
          icon={<GlobalOutlined />}
        >
          Español
        </Button>
        <Button
          id="login-button"
          onClick={onOpenModal}
          icon={
            <UserOutlined
              style={{ fontSize: "20px", color: "#017db2", fontWeight: "bold" }}
            />
          }
        />
      </Flex>

      <Modal
        open={openLogin}
        onClose={onCloseModal}
        center
        showCloseIcon={false}
        classNames={{
          modal: "loginModal",
        }}
      >
        <Login onClose={onCloseModal} />
      </Modal>
    </Flex>
  );
}
