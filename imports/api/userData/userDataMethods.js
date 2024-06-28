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
  new_user({ username, password, bonitaUser, token }) {
    Accounts.createUser({ username, password, profile: { bonitaUser, token } });
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

  //task functions
  start_task_repository() {
    Meteor.users.update({ _id: Meteor.userId() }, { $addToSet: { tasks: [] } });
  },
  add_task(taskData) {
    Meteor.users.update(
      { _id: Meteor.userId() },
      { $addToSet: { tasks: taskData } }
    );
  },
  get_task_data(taskId) {
    const userData = Meteor.users.findOne({ _id: Meteor.userId() });
    if (Object.keys(userData).includes("tasks")) {
      const myTasks = userData.tasks.filter((task) => task.taskId == taskId);
      if (myTasks.length) return myTasks;
      else {
        Meteor.call("add_task", { taskId });
      }
    } else return Meteor.call("start_task_repository");
  },
  update_task({ taskId, field, value }) {
    const datafield = `tasks.$.${field}`;
    Meteor.users.update(
      { _id: Meteor.userId(), "tasks.taskId": taskId },
      { $set: { [`${datafield}`]: value } }
    );
  },
  update_backgrounds({ taskId, id, backgroundFiles }) {
    const datafield = `tasks.$.backgrounds.${id}`;
    Meteor.users.update(
      { _id: Meteor.userId(), "tasks.taskId": taskId },
      { $set: { [`${datafield}`]: backgroundFiles } }
    );
  },
  update_cv_files({ taskId, id, cvFiles }) {
    const datafield = `tasks.$.cvFiles.${id}`;
    Meteor.users.update(
      { _id: Meteor.userId(), "tasks.taskId": taskId },
      { $set: { [`${datafield}`]: cvFiles } }
    );
  },
  update_Health_service_files({ taskId, id, HSFiles }) {
    const datafield = `tasks.$.healthResponse.${id}`;
    Meteor.users.update(
      { _id: Meteor.userId(), "tasks.taskId": taskId },
      { $set: { [`${datafield}`]: HSFiles } }
    );
  },
  delete_task(taskId) {
    Meteor.users.update(
      { _id: Meteor.userId() },
      { $pull: { tasks: { taskId } } }
    );
  },
  has2fa() {
    const user = Meteor.users.findOne(Meteor.userId());
    const res = Object.keys(user.services.twoFactorAuthentication).includes(
      "type"
    );
    return res;
  },
});
