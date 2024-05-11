import Axios from "axios";
import React from "react";
import { SecurityContext } from "../context/securityProvider";

export default function GetUser() {
  const { token } = React.useContext(SecurityContext);
  React.useEffect(() => {
    Axios.get("http://34.125.240.150:8080/bonita/API/system/session/unusedid", {
      headers: {
        "X-Bonita-API-Token": token,
      },
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.log("error adquiriendo usuario"));
  }, []);
  return <div>GetUser</div>;
}
