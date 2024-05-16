import React from "react";
import { getView } from "../config/getView";

export const MainViewContext = React.createContext();

export default function MainViewProvider({ children, defaultView }) {
  const [view, setNewView] = React.useState();
  const [userName, setUserName] = React.useState("");

  function setView(newView) {
    window.sessionStorage.setItem("currentView", newView);
    setNewView(getView(newView));
  }

  React.useEffect(() => {
    const user = Meteor.users.findOne(Meteor.userId({}));
    setUserName(user.username);

    const currentView = window.sessionStorage.getItem("currentView");
    if (currentView) setView(currentView);
    else setView(defaultView);
  }, []);

  return (
    <MainViewContext.Provider value={{ view, setView, userName }}>
      {children}
    </MainViewContext.Provider>
  );
}
