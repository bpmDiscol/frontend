import React from "react";
import { Meteor } from "meteor/meteor";
import { NotificationsContext } from "../../context/notificationsProvider";
import { Button, Flex, Modal } from "antd";
import Transition from "../transition";
import { Buffer } from "buffer";
import { Accounts } from "meteor/accounts-base";

import "./login.css";
import OTP from "./OTP";

export default function PublicLogin() {
  const { openNotification } = React.useContext(NotificationsContext);
  const [isLogIn, setLogIn] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [modalOTP, openOTPModal] = React.useState(false);
  const [bonitaData, setBonitaData] = React.useState();

  //TODO: cerrar sesion activa cuando el usuario se logea nuevamente
  async function meteorLogin({
    bonitaUser,
    token,
    username,
    password,
    JSESSIONID,
  }) {
    Meteor.loginWithPassword(username, password, async (error) => {
      if (error?.reason == "User not found") {
        await Meteor.callAsync("new_user", {
          username,
          password,
          bonitaUser,
          token,
        }).catch((error) => console.error(error));
        Meteor.loginWithPassword(username, password);
      }
      if (error?.error === "no-2fa-code") openOTPModal(true);
    });
    setBonitaData({bonitaUser, token, JSESSIONID});
    sessionStorage.setItem("constId", bonitaUser);
  }

  async function tryLogin(e) {
    e.preventDefault();
    if (username && password) {
      setIsLoading(true);
      Meteor.call(
        "bonita_login",
        { username, password },
        async (error, result) => {
          if (error) console.log(error.reason);
          else {
            if (result.variant == "success")
              await meteorLogin({
                bonitaUser: result.bonitaUser,
                token: result.token,
                JSESSIONID: result.JSESSIONID,
                username,
                password,
              });
            if (result.variant == "error")
              openNotification(result.variant, result?.message, "");
          }
          setIsLoading(false);
        }
      );
    }
  }

  return (
    <Flex justify="center" align="center" style={{ height: "100lvh" }}>
      <Transition key={isLogIn ? "1" : "0"} effect={"zoom-in"}>
        <article id="login-box">
          <div className="heading">
            <img className="login-logo" src="/logo-image.png" />
            <h1>DISCOL</h1>
          </div>
          <h3>Acceso BPM</h3>
          <form className="form">
            <input
              required={true}
              className="input"
              type="text"
              name="username"
              id="username"
              placeholder="Usuario"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
            <input
              required={true}
              className="input"
              type="password"
              name="password"
              id="password"
              placeholder="Contraseña"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />

            <button
              className="login-button"
              onClick={(e) => tryLogin(e)}
              disabled={isLoading}
            >
              {isLoading ? "Espere..." : "Entrar"}
            </button>
          </form>
        </article>
      </Transition>
      <Modal
        centered
        closable={false}
        open={modalOTP}
        onCancel={() => openOTPModal(false)}
        footer={
          <Flex justify="center">
            <Button onClick={() => openOTPModal(false)}>Cancelar</Button>
          </Flex>
        }
      >
       {bonitaData && <OTP
          username={username}
          password={password}
          bonitaData={bonitaData}
          logged
        />}
      </Modal>
    </Flex>
  );
}
