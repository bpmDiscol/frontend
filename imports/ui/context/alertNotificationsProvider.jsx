import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { AlertsCollection } from "../../api/alerts/alertsCollection";
import { NotificationsContext } from "./notificationsProvider";
import { Button, Space } from "antd";
import { MainViewContext } from "./mainViewProvider";
import { saveCase, saveTask, saveTaskName } from "../config/taskManagement";

export const AlertNotificationsContext = React.createContext();

export default function AlertNotificationsProvider({ children }) {
  const { openNotification, api } = React.useContext(NotificationsContext);
  const { setView } = React.useContext(MainViewContext);

  const [myMemberships, setMyMemberships] = React.useState();

  const alerts = useTracker(() => {
    if (myMemberships) {
      const query = {
        $or: myMemberships.map((membership) => ({
          memberships: { $all: membership },
        })),
      };
      Meteor.subscribe("alerts");
      const generalAlerts = AlertsCollection.find(query).fetch();
      const directedAlerts = AlertsCollection.find({
        directTo: parseInt(sessionStorage.getItem("constId")),
      }).fetch();
      return generalAlerts.concat(directedAlerts);
    }
  });
  
  function doTask(taskName, taskId, caseId) {
    setView(taskName);
    saveTask(taskId);
    saveCase(caseId);
    saveTaskName(taskName);
  }

  async function assignTask(taskId) {
    const resp = await Meteor.callAsync("assign_task_to", {
      user: "me",
      currentUser: sessionStorage.getItem("constId"),
      taskId,
    }).catch((e) => console.log(e));

    if (resp?.error == "no user") {
      openNotification(
        "error",
        "¡Algo esta mal!",
        "Revisa tus credenciales nuevamente"
      );
      safeLogOut();
      return;
    }
    if (sessionStorage.getItem("currentView") == "tasks") setView("tasks");
  }

  function markAsViewed(id) {
    api.destroy(id);
    Meteor.callAsync("watch_alert", id).catch((e) => console.log(e));
  }

  React.useEffect(() => {
    Meteor.call("get_my_memberships", (err, resp) => {
      if (err) console.log(err);
      else setMyMemberships(resp);
    });
  }, []);

  React.useEffect(() => {
    Meteor.call("filter_watched_alerts", alerts, (err, resp) => {
      if (!err && resp?.length) {
        resp.forEach((infoView) => {
          const btn = (
            <Space>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  markAsViewed(infoView._id);
                }}
              >
                Marcar como vista
              </Button>
              {!infoView.assignedTo && (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    markAsViewed(infoView._id);
                    assignTask(infoView.taskId);
                  }}
                >
                  Tomar tarea
                </Button>
              )}
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  markAsViewed(infoView._id);
                  assignTask(infoView.taskId).then(
                    doTask(infoView.process, infoView.taskId, infoView.caseId)
                  );
                }}
              >
                Realizar tarea
              </Button>
            </Space>
          );
          openNotification(
            "info",
            infoView.title,
            infoView.message,
            btn,
            infoView._id,
            0
          );
        });
      }
    });
  }, [alerts]);

  return (
    <AlertNotificationsContext.Provider value={{ alerts }}>
      {children}
    </AlertNotificationsContext.Provider>
  );
}
