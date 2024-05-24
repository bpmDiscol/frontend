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

  function meteorLogin(bonitaUser) {
    Meteor.loginWithPassword(username, password, (error) => {
      const user = Meteor.users.findOne(Meteor.userId());
      const storedBonitaUser = user?.profile?.bonitaUser;

      if ((error && error.reason == "User not found") || !storedBonitaUser) {
        Meteor.call("new_user", { username, password, bonitaUser }, (error) => {
          if (error) console.log(error);
          else meteorLogin();
        });
      }
      location.reload();
    });
  }

  function tryLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    Meteor.call("bonita_login", { username, password }, (error, result) => {
      if (error) console.log(error.reason);
      else {
        //TODO: check if user is previously connected
        if (result.variant == "success") meteorLogin(result.bonitaUser);
        enqueueSnackbar(result.message, {
          variant: result.variant,
          autoHideDuration: 1000,
        });
      }
      setIsLoading(false);
    });
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
