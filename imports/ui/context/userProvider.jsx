import React from "react";

export const UserContext = React.createContext();

export default function UserProvider({ children, requestUser }) {
  const [user, setUser] = React.useState();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {user ? children : requestUser}
    </UserContext.Provider>
  );
}
