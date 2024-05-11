import React from "react";
import Login from "./login";
import Modal from "react-responsive-modal";


export default function LoginModal({openLogin, onCloseLogin, setToken}) {
    
  return (
    <Modal
      open={openLogin}
      onClose={onCloseLogin}
      center
      classNames={{
        overlay: "customOverlay",
        modal: "loginModal",
      }}
      showCloseIcon={false}
    >
      <Login onClose={onCloseLogin} setToken={setToken} />
    </Modal>
  );
}
