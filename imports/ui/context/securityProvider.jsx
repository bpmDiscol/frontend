import React from "react";
import { useLoggedUser } from "meteor/quave:logged-user-react";
import Loader from "../pages/loader";

export const SecurityContext = React.createContext();

export default function SecurityProvider({ children, publicPage }) {
  const [token, setToken] = React.useState();
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();

  if (isLoadingLoggedUser) return <Loader />;

  return (
    <SecurityContext.Provider value={{ token, setToken }}>
      {loggedUser ? children : publicPage}
    </SecurityContext.Provider>
  );
}
