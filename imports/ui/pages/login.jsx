import React from "react";
import { Meteor } from "meteor/meteor";
import { enqueueSnackbar } from "notistack";

import "./styles/login.css";

export default function Login({ onClose }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  function closeMe(e) {
    e.preventDefault();
    onClose();
  }

  function meteorLogin({ bonitaUser, token, username, password }) {
    Meteor.loginWithPassword(username, password, async (error) => {
      if (error && error.reason == "User not found") {
        await Meteor.callAsync("new_user", {
          username,
          password,
          bonitaUser,
          token,
        });
        Meteor.loginWithPassword(username, password);
      }
    });
    Meteor.users.update(
      { _id: Meteor.userId() },
      { $set: { profile: { bonitaUser, token } } }
    );
  }

  function tryLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    Meteor.call(
      "bonita_login",
      { username, password },
      async (error, result) => {
        if (error) console.log(error.reason);
        else {
          if (result.variant == "success")
            meteorLogin({
              bonitaUser: result.bonitaUser,
              token: result.token,
              username,
              password,
            });

          enqueueSnackbar(result.message, {
            variant: result.variant,
            autoHideDuration: 1000,
          });
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
    </div>
  );
}
