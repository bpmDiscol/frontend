import { Meteor } from "meteor/meteor";
import { AlertsCollection } from "./alertsCollection";

Meteor.methods({
  filter_watched_alerts(alerts) {
    if (alerts) {
      const watchedAlerts = Meteor.user({
        fields: { watchedAlerts: 1 },
      })?.watchedAlerts;

      if (watchedAlerts) {
        return alerts.filter((alert) => !watchedAlerts.includes(alert._id));
      }
      return alerts;
    }
  },
  watch_alert(alertId) {
    Meteor.users.update(Meteor.userId(), { $addToSet: { watchedAlerts: alertId } });
  },
  create_alert(alert) {
    AlertsCollection.insert({ ...alert, date: new Date() });
  },
});
