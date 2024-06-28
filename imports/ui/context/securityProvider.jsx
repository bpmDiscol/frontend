import React from "react";
import { useLoggedUser } from "meteor/quave:logged-user-react";
import Loader from "../pages/loader";
import {
  goUserOffline,
  goUserOnline,
  isDelayedUser,
  safeLogOut,
} from "../misc/userStatus";
import No2fa from "../components/publicLogin/no2fa";

export const SecurityContext = React.createContext();

export default function SecurityProvider({ children, publicPage }) {
  const [token, setToken] = React.useState();
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  const [delayedUser, setDelayedUser] = React.useState(false);
  const [enable2fa, setEnable2fa] = React.useState(false);
  React.useEffect(() => {
    function detectVisibility() {
      if (document.visibilityState == "hidden") {
        // console.log('user off')
        goUserOffline();
      } else {
        if (isDelayedUser()) {
          // console.log('delayed user >> logout')
          setDelayedUser(true);
          safeLogOut();
        } else {
          // console.log('return onine')
          setDelayedUser(false);
          goUserOnline();
        }
      }
    }
    if (!loggedUser) setEnable2fa(false);
    if (loggedUser) {
      Meteor.call("has2fa", (_, resp) => setEnable2fa(resp));

      document.addEventListener("visibilitychange", detectVisibility);
    } else document.removeEventListener("visibilitychange", detectVisibility);
  }, [loggedUser]);

  if (isLoadingLoggedUser) return <Loader />;
  return (
    <SecurityContext.Provider value={{ token, setToken, setEnable2fa }}>
      {loggedUser && !delayedUser ? (
        enable2fa ? (
          children
        ) : (
          <No2fa />
        )
      ) : (
        publicPage
      )}
    </SecurityContext.Provider>
  );
}
