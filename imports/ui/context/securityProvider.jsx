import React from "react";
import { useLoggedUser } from "meteor/quave:logged-user-react";
import Loader from "../pages/loader";
import {
  goUserOffline,
  goUserOnline,
  isDelayedUser,
  safeLogOut,
} from "../misc/userStatus";

export const SecurityContext = React.createContext();

export default function SecurityProvider({ children, publicPage }) {
  const [token, setToken] = React.useState();
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();
  const [delayedUser, setDelayedUser] = React.useState(false);

  React.useEffect(() => {
    function detectVisibility() {
      if (document.visibilityState == "hidden") {
        goUserOffline();
      } else {
        if (isDelayedUser()) {
          setDelayedUser(true);
          safeLogOut();
        } else {
          setDelayedUser(false);
          goUserOnline();
        }
      }
    }
console.log(`Logued: ${loggedUser} delayed: ${!delayedUser} status: ${loggedUser & delayedUser}`)
    if (loggedUser) {
      detectVisibility();
      document.addEventListener("visibilitychange", detectVisibility);
    } else document.removeEventListener("visibilitychange", detectVisibility);
  }, [loggedUser]);

  if (isLoadingLoggedUser) return <Loader />;
  return (
    <SecurityContext.Provider value={{ token, setToken }}>
      {loggedUser && !delayedUser ? children : publicPage}
    </SecurityContext.Provider>
  );
}
