import { Meteor } from "meteor/meteor";
import { AlertsCollection } from "./alertsCollection";
import sendMails from "./sendMails";

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
  async getMailDatabyMembershyp(membership) {
    const users = await Meteor.users
      .rawCollection()
      .aggregate([
        {
          $match: {
            "profile.memberships": {
              $elemMatch: {
                $size: 2, // Solo arrays con exactamente 2 elementos
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            bonitaUser: "$profile.bonitaUser",
            email: "$profile.email",
            username: 1,
            matchingMemberships: {
              $filter: {
                input: "$profile.memberships",
                as: "membership",
                cond: {
                  $and: [
                    { $eq: [{ $size: "$$membership" }, 2] }, // Coincide con el tamaño
                    { $setEquals: ["$$membership", membership] }, // Coincide con los elementos ignorando el orden
                  ],
                },
              },
            },
          },
        },
        {
          $match: {
            "matchingMemberships.0": { $exists: true }, // Filtrar solo documentos con coincidencias
          },
        },
      ])
      .toArray();
    return users;
  },
  get_template(process) {
    const alerts = [
      "employee_request_leader_reject",
      "employee_request_leader_alert",
      "employee_request_leader_warning",
      "sign_contract_done",
    ];
    return Assets.getText(
      alerts.includes(process)
        ? "mailAlertTemplate.html"
        : "mailResponseTemplate.html"
    );
  },
});
