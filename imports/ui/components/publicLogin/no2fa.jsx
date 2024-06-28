import React from "react";
import { Accounts } from "meteor/accounts-base";
import { Button, Flex, Input, Modal, Result } from "antd";
import { NotificationsContext } from "../../context/notificationsProvider";
import { safeLogOut } from "../../misc/userStatus";
import OTP from "./OTP";

export default function No2fa() {
  const { openNotification } = React.useContext(NotificationsContext);
  const [qrCode, setQrCode] = React.useState();
  const [otp, setOtp] = React.useState(false);

  React.useEffect(() => {
    Accounts.generate2faActivationQrCode("Discol BPM", (err, result) => {
      if (err) {
        // console.error("...", err);

        return;
      }
      const { svg, secret, uri } = result;

      setQrCode(Buffer.from(svg).toString("base64"));
    });
  }, []);

  return (
    <Flex vertical justify="center" align="center" style={{ height: "100dvh" }}>
      {qrCode && (
        <Result
          icon={<img width="200" src={`data:image/svg+xml;base64,${qrCode}`} />}
          title="DISCOL BPM"
          subTitle="Para continuar necesitas activar la autenticación de 2 factores"
          extra={[
            <Button
              onClick={safeLogOut}
              style={{ width: "150px" }}
              type="default"
              key={1}
            >
              Desconectar
            </Button>,
            <Button
              onClick={() => setOtp(true)}
              style={{ width: "150px" }}
              type="primary"
              key={2}
            >
              Siguiente
            </Button>,
          ]}
        />
      )}
      <Modal
        centered
        closable={false}
        open={otp}
        onCancel={() => setOtp(false)}
        footer={
          <Flex justify="center">
            <Button onClick={() => setOtp(false)}>Cancelar</Button>
          </Flex>
        }
      >
        <OTP />
      </Modal>
    </Flex>
  );
}
