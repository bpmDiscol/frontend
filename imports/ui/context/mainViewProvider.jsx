import React from "react";
import Dashboard from "../pages/dashboard";
import Process from "../pages/process";
import Tasks from "../pages/tasks";

export const MainViewContext = React.createContext();

export default function MainViewProvider({ children, defaultView }) {
  const [view, setView] = React.useState();
  const [userName, setUserName] = React.useState("");
  const [bonitaUserId, setBonitaUserId] = React.useState();

  const views = {
    dashboard: <Dashboard bonitaUserId={bonitaUserId} />,
    process: <Process bonitaUserId={bonitaUserId} />,
    tasks: <Tasks bonitaUserId={bonitaUserId} />,
  };

  React.useEffect(() => {
    const user = Meteor.users.findOne(Meteor.userId({}));
    setBonitaUserId(user.profile.bonitaUser);
    setUserName(user.username);
  }, []);

  React.useEffect(() => {
    const currentView = window.sessionStorage.getItem("currentView");
    if (currentView) setView(currentView);
    else setView(defaultView);
  }, []);

  React.useEffect(() => {
    window.sessionStorage.setItem("currentView", view);
  }, [view]);

  return (
    <MainViewContext.Provider value={{ view, setView, views, userName }}>
      {children}
    </MainViewContext.Provider>
  );
}
