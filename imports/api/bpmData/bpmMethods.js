import { Meteor } from "meteor/meteor";

const humanTasks = "/API/bpm/humanTask?p=0&c=100&f=state%3Dready";
const doneTasks =
  "http://34.125.240.150:8080/bonita/API/bpm/archivedHumanTask?p=0&c=100&f=assigned_id%3D";

Meteor.methods({
  async get_available_tasks() {
    const availableTasks = await Meteor.call("get_data", {
      url: humanTasks,
      params: {},
    });

    return availableTasks;
  },
  async get_done_tasks({bonitaUserId}) {
    const availableTasks = await Meteor.call("get_data", {
      url: doneTasks + bonitaUserId,
      params: {},
    });

    return availableTasks;
  },
});
