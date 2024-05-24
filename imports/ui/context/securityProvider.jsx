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
    if (loggedUser) {
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
