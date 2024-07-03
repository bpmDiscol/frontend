import { Meteor } from "meteor/meteor";
import { AlertsCollection } from "./alertsCollection";

Meteor.methods({
  get_my_alerts(search) {
    if (search) {
      const query = {
        $or: search.map((arr) => ({
          user: { $all: arr },
        })),
      };
      return AlertsCollection.find(query);
    }
    return [];
  },
  create_alert({ user }) {
    AlertsCollection.insert({ user });
  },
  async get_my_memberships() {
    const bonitaUserId = Meteor.users.findOne(Meteor.userId({}))?.profile
      ?.bonitaUser;

    const memberships = await Meteor.callAsync("get_data", {
      url: "API/identity/membership?p=0&c=10&f=user_id%3D" + bonitaUserId,
      params: {},
    }).catch((error) => console.error(error));

    if (memberships != "error" && memberships != "no token") {
      const roles = await memberships?.map(async (membership) => {
        const roleDescription = await Meteor.callAsync("get_data", {
          url: `/API/identity/role/${membership.role_id}`,
          params: {},
        });

        const groupDescription = await Meteor.callAsync("get_data", {
          url: `/API/identity/group/${membership.group_id}`,
          params: {},
        });

        return [roleDescription?.name, groupDescription.name];
      });
      return await Promise.all(roles);
    }
  },
});
