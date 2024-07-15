import React from "react";
import { Meteor } from "meteor/meteor";

import "./login.css";
import { NotificationsContext } from "../../context/notificationsProvider";
import { message } from "antd";

export default function Login({ onClose }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [openOTP, setOpenOTP] = React.useState(false);

  const { openNotification } = React.useContext(NotificationsContext);

  function closeMe(e) {
    e.preventDefault();
    onClose();
  }

  function meteorLogin({ bonitaUser, token, username, password, JSESSIONID }) {
    console.log("login...");
    Meteor.loginWithPassword(username, password, async (error) => {
      if (error?.reason == "User not found") {
        await Meteor.callAsync("new_user", {
          username,
          password,
          bonitaUser,
          token,
        }).catch((error) => console.error(error));

        Meteor.loginWithPassword(username, password, (error) => {
          if (error?.error === "no-2fa-code") setOpenOTP(true);
        });

        Meteor.callAsync("update_credentials", {
          bonitaUser,
          token,
          JSESSIONID,
        }).catch((error) => console.error(error));
      }
    });
  }

  function tryLogin(e) {
    message.info("jelou");
    e.preventDefault();
    setIsLoading(true);
    Meteor.call(
      "bonita_login",
      { username, password },
      async (error, result) => {
        if (error) console.log(error.reason);
        else {
          if (result.variant == "success") console.log("login");
          meteorLogin({
            bonitaUser: result.bonitaUser,
            token: result.token,
            JSESSIONID: result.JSESSIONID,
            username,
            password,
          });

          openNotification(
            result.variant,
            "Mensaje para: " + username,
            result?.message
          );
        }
        setIsLoading(false);
      }
    );
  }

  return (
    <div className="main">
      <div className="login-box">
        <img src="/logo.png" />
        <p>Acceso de empleado</p>

        <form>
          <input
            type="text"
            name="txt"
            placeholder="User name"
            required=""
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
          <input
            type="text"
            name="pswd"
            placeholder="Password"
            required=""
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <div className="buttons">
            <button disabled={isLoading} onClick={(e) => tryLogin(e)}>
              {isLoading ? "Espere..." : "Entrar"}
            </button>
            <button onClick={(e) => closeMe(e)}>Cancelar</button>
          </div>
        </form>
      </div>
      {/* <Modal
        centered
        closable={false}
        open={openOTP}
        onCancel={() => setOtp(false)}
        footer={
          <Flex justify="center">
            <Button onClick={() => setOpenOTP(false)}>Cancelar</Button>
          </Flex>
        }
      >
        <OTP username={username} password={password} logged />
      </Modal> */}
    </div>
  );
}
