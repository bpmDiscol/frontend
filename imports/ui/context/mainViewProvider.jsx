import React from "react";
import { getView } from "../config/getView";

export const MainViewContext = React.createContext();

export default function MainViewProvider({ children, defaultView }) {
  const [view, setNewView] = React.useState();
  const [userName, setUserName] = React.useState("");
  const [newKey, setNewKey] = React.useState(0);
  function disableBack() {
    window.history.forward();
  }
  setTimeout(disableBack(), 0);
  window.onbeforeunload = function () {
    null;
  };

  function setView(newView) {
    window.sessionStorage.setItem("currentView", newView);
    setNewView(getView(newView));
    setNewKey(Math.random());
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
      <React.Fragment key={newKey}>{children}</React.Fragment>
    </MainViewContext.Provider>
  );
}
