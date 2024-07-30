import { Meteor } from "meteor/meteor";
import { AlertsCollection } from "./alertsCollection";

Meteor.methods({
  filter_watched_alerts(alerts, user) {
    if (alerts) {
      const watchedAlerts = Meteor.users.findOne(user)?.watchedAlerts;

      if (watchedAlerts) {
        return alerts.filter((alert) => !watchedAlerts.includes(alert._id));
      }
      return alerts;
    }
  },
  watch_alert(alertId, user) {
    Meteor.users.update(user, { $addToSet: { watchedAlerts: alertId } });
  },
  create_alert(alert) {
    AlertsCollection.insert({ ...alert, date: new Date() });
  },
  deleteOldAlerts(hours) {
    AlertsCollection.remove({
      date: { $lt: new Date(Date.now() - hours * 60 * 60 * 1000) },
    });
  },
});
