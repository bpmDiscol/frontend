import React from "react";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Flex, Input, Typography } from "antd";
import { NotificationsContext } from "../../context/notificationsProvider";
import { safeLogOut } from "../../misc/userStatus";
import { SecurityContext } from "../../context/securityProvider";

export default function OTP({
  username,
  password,
  bonitaData,
  logged = false,
}) {
  const { Title } = Typography;
  const { openNotification } = React.useContext(NotificationsContext);
  const { setEnable2fa } = React.useContext(SecurityContext);

  function evaluateCode(code) {
    if (code.length == 6) {
      if (logged) {
        Meteor.loginWithPasswordAnd2faCode(
          username,
          password,
          code,
          async (error) => {
            if (error) {
              openNotification(
                "error",
                "Codigo no válido",
                "Asegurate de que esté bien escrito y durante el tiempo de vigencia"
              );
              return;
            }
            setEnable2fa(true);

            await Meteor.callAsync("update_credentials", {
              ...bonitaData,
              user: Meteor.userId(),
            }).catch((error) => console.error(error));
            Meteor.logoutOtherClients();
            openNotification("success", "Bienvenido a DISCOL BPM", "");
          }
        );
      } else {
        Accounts.enableUser2fa(code, (err) => {
          if (err?.error == "invalid-2fa-code") {
            openNotification(
              "error",
              "Código inválido",
              "Introduce nuevamente la clave en el tiempo estipulado"
            );
            return;
          }
          openNotification(
            "success",
            "¡Excelente!",
            "Ya se encuentra registrado el 2FA. Este será tu ingreso normal a partir de ahora"
          );
          safeLogOut();
        });
      }
    }
  }

  return (
    <Flex vertical justify="center" align="center">
      <Title level={5}>Introduce el código generado</Title>
      <Input.OTP length={6} onChange={(value) => evaluateCode(value)} />
    </Flex>
  );
}
