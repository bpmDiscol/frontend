import React from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import "./styles/public.css";
import Login from "./login";
import { SecurityContext } from "../context/securityProvider";

export default function Public() {
  const [openLogin, setOpenLogin] = React.useState(false);
  const onOpenModal = () => setOpenLogin(true);
  const onCloseModal = () => setOpenLogin(false);
  const { setToken } = React.useContext(SecurityContext);
  return (
    <div className="public-page">
      <header>
        <div className="image-container">
          <img src="/logo.png" />
        </div>

        <div className="header-buttons">
          <div className="button">Hoja de vida</div>
          <div className="button">Quejas o reclamos</div>
          <div id="login-button" className="button" onClick={onOpenModal}>
            🔏
          </div>
        </div>
      </header>
      <main>main</main>
      <footer>footer</footer>
      <Modal
        open={openLogin}
        onClose={onCloseModal}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "loginModal",
        }}
        showCloseIcon={false}
      >
        <Login onClose={onCloseModal} setToken={setToken} />
      </Modal>
    </div>
  );
}
