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
  async get_employee_request_data({ taskId }) {
    const context = await Meteor.callAsync("get_data", {
      url: `/API/bpm/userTask/${taskId}/context`,
      params: {},
    });

    return await Meteor.callAsync("get_data", {
      url: context.requestEmployeeData_ref.link,
      params: {},
    });
  },
  assign_task_to({ taskId, toUser }) {
    const user = toUser
      ? Meteor.users.findOne(Meteor.userId({})).profile.bonitaUser
      : "";
    console.log(user)
    Meteor.call("put_data", {
      url: `/API/bpm/userTask/${taskId}`,
      params: {
        assigned_id: user,
      },
    });
  },
});
