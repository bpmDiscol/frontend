import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { userDataCollection } from "./userDataCollection";

Meteor.methods({
  go_online(user) {
    return Meteor.users.update({ _id: user }, { $set: { status: "online" } });
  },

  go_offline(user) {
    return Meteor.users.update({ _id: user }, { $set: { status: "offline" } });
  },
  new_user({ username, password, bonitaUser, token, axiosCookie }) {
    Accounts.createUser({ username, password, profile: { bonitaUser, token, axiosCookie } });
  },
  update_image(image, user) {
    return Meteor.users.update({ _id: user }, { $set: { image } });
  },
  remove_me(user) {
    return userDataCollection.remove({ _id: user });
  },
  get_user_image(_id) {
    return Meteor.users.findOne({ _id }, { image: 1 })?.image;
  },

  //task functions
  start_task_repository(user) {
    Meteor.users.update({ _id: user }, { $addToSet: { tasks: [] } });
  },
  add_task(taskData, user) {
    Meteor.users.update({ _id: user }, { $addToSet: { tasks: taskData } });
  },
  get_task_data(taskId, user) {
    const userData = Meteor.users.findOne({ _id: user });
    if (Object.keys(userData).includes("tasks")) {
      const myTasks = userData.tasks.filter((task) => task.taskId == taskId);
      if (myTasks.length) return myTasks;
      else {
        Meteor.call("add_task", { taskId }, user);
      }
    } else return Meteor.call("start_task_repository", user);
  },
  update_task({ taskId, field, value, user }) {
    const datafield = `tasks.$.${field}`;
    Meteor.users.update(
      { _id: user, "tasks.taskId": taskId },
      { $set: { [`${datafield}`]: value } }
    );
  },
  update_backgrounds({ taskId, id, backgroundFiles, user }) {
    const datafield = `tasks.$.backgrounds.${id}`;
    Meteor.users.update(
      { _id: user, "tasks.taskId": taskId },
      { $set: { [`${datafield}`]: backgroundFiles } }
    );
  },
  update_cv_files({ taskId, id, cvFiles, user }) {
    const datafield = `tasks.$.cvFiles.${id}`;
    Meteor.users.update(
      { _id: user, "tasks.taskId": taskId },
      { $set: { [`${datafield}`]: cvFiles } }
    );
  },
  update_Health_service_files({ taskId, id, HSFiles, user }) {
    const datafield = `tasks.$.healthResponse.${id}`;
    Meteor.users.update(
      { _id: user, "tasks.taskId": taskId },
      { $set: { [`${datafield}`]: HSFiles } }
    );
  },
  delete_task(taskId, user) {
    Meteor.users.update({ _id: user }, { $pull: { tasks: { taskId } } });
  },
  has2fa(user) {
    const services = Meteor.users.findOne({ _id: user })?.services;
    if (services)
      if (Object.keys(services).includes("twoFactorAuthentication")) {
        return Object.keys(services.twoFactorAuthentication).includes("type");
      }

    return false;
  },
  delete_otp(_id) {
    Meteor.users.update(
      { _id },
      { $unset: { "services.twoFactorAuthentication": 1 } }
    );
  },
});
