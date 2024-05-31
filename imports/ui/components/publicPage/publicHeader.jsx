import { Flex, Image } from "antd";
import React from "react";
import Modal from "react-responsive-modal";
import Login from "../../pages/login";
import "../../pages/styles/public.css";

export default function PublicHeader() {
  const [openLogin, setOpenLogin] = React.useState(false);
  const onOpenModal = () => setOpenLogin(true);
  const onCloseModal = () => setOpenLogin(false);
  return (
    <Flex justify="space-between" align="center" style={{ height: "4rem" }}>
      <Image src="/logo.png" style={{ width: "10rem" }} />
      <div id="login-button" className="button" onClick={onOpenModal}>
        🔏
      </div>
      <Modal
        open={openLogin}
        onClose={onCloseModal}
        center
        showCloseIcon={false}
      >
        <Login onClose={onCloseModal} />
      </Modal>
    </Flex>
  );
}