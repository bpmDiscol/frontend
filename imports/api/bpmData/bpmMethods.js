import { Meteor } from "meteor/meteor";

const humanTasks = "/API/bpm/humanTask?p=0&c=100&f=state%3Dready";

Meteor.methods({
  async get_available_tasks() {
    return await Meteor.call("get_data", {
      url: humanTasks,
      params: {},
    });
  },
  async get_done_tasks({ bonitaUserId }) {
    return await Meteor.call("get_data", {
      url: `/API/bpm/archivedHumanTask?p=0&c=100&f=assigned_id%3D${bonitaUserId}`,
      params: {},
    });
  },
  async get_context(taskId) {
    return await Meteor.call("get_data", {
      url: `/API/bpm/userTask/${taskId}/context`,
      params: {},
    });
  },
  async get_session() {
    return await Meteor.call("get_data", {
      url: `/API/system/session/unusedId`,
      params: {},
    });
  },
  async get_context({ taskId }) {
    return await Meteor.call("get_data", {
      url: `/API/bpm/userTask/${taskId}/context`,
      params: {},
    });
  },
  async get_task({ taskId }) {
    return await Meteor.call("get_data", {
      url: `/API/bpm/userTask/${taskId}`,
      params: {},
    });
  },
  async assign_task_to({ userId }) {
    const taskId = await Meteor.callAsync("get_task_id");
    const user =
      userId == -1
        ? Meteor.users.findOne(Meteor.userId({})).profile.bonitaUser
        : userId;
    Meteor.call("put_data", {
      url: `/API/bpm/userTask/${taskId}`,
      params: {
        assigned_id: user,
      },
    });
  },
  set_task_id({ taskId }) {
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { taskId } });
  },
  get_task_id() {
    return Meteor.users.findOne(Meteor.userId({})).taskId;
  },
  assign_me_task() {
    Meteor.call("assing_task_to", { userId: -1 });
  },
  unasign_task() {
    Meteor.call("assing_task_to", { userId: "" });
  },
  async request_data_links({ requestLinks }) {
    const requestData = requestLinks.map((link) => {
      return Meteor.callAsync("get_data", {
        url: link.href,
        params: {},
      });
    });
    const allRequestData = await Promise.all(requestData);

    const response = {};
    allRequestData.forEach((data, index) => {
      response[requestLinks[index].rel] = data;
    });
    return response;

    // return response.map((data, index) => {
    //   return { ...data, name: requestLinks[index].rel };
    // });
  },
});
