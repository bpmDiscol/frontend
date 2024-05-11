import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { userDataCollection } from "./userDataCollection";

Meteor.methods({
  go_online() {
    return Meteor.users.update(
      { _id: Meteor.userId() },
      { $set: { status: "online" } }
    );
  },
  go_offline() {
    return Meteor.users.update(
      { _id: Meteor.userId() },
      { $set: { status: "offline" } }
    );
  },
  new_user({ username, password, bonitaUser }) {
    Accounts.createUser({ username, password, profile: { bonitaUser } });
  },
  update_image(image) {
    return Meteor.users.update({ _id: Meteor.userId() }, { $set: { image } });
  },
  remove_me() {
    return userDataCollection.remove({ _id: Meteor.userId() });
  },
  get_user_image(_id) {
    return Meteor.users.findOne({ _id }, { image: 1 })?.image;
  },
});
