import { Meteor } from "meteor/meteor";
import { Picker } from "meteor/meteorhacks:picker";

const humanTasks = "/API/bpm/humanTask?p=0&c=100&";

const taskMode = {
  available:
    "/API/bpm/humanTask?p=0&c=100&f=state%3Dready&f=assigned_id%3D&f=user_id%3D",
  assigned: "/API/bpm/humanTask?p=0&c=100&f=state%3Dready&f=assigned_id%3D",
  doneTasks:
    "/API/bpm/archivedHumanTask?p=0&c=100&&f=state%3Dcompleted&f=assigned_id%3D",
};

Picker.route("/post", function (params, req, res, next) {
  res.end();
});

Meteor.methods({
  async get_task_list(filter) {
    const userId = Meteor.userId({});
    if (userId) {
      const bonitaId = Meteor.users.findOne(Meteor.userId({})).profile
        .bonitaUser;
      return await Meteor.call("get_data", {
        url: taskMode[filter] + bonitaId,
        params: {},
      });
    }
    console.log("no user id");
    return [];
  },
  async get_available_tasks() {
    const userId = Meteor.users.findOne(Meteor.userId({})).profile.bonitaUser;
    return await Meteor.call("get_data", {
      url: availableTasks + userId,
      params: {},
    });
  },
  async get_done_tasks({ bonitaUserId }) {
    return await Meteor.call("get_data", {
      url: doneTasks + bonitaUserId,
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
  async assign_task_to({ user }) {
    const currentUser = Meteor.users.findOne(Meteor.userId({}));
    const taskId = currentUser.taskId;
    const assigned_id = user == "me" ? currentUser.profile.bonitaUser : user;
    if (taskId && assigned_id) {
      Meteor.call("put_data", {
        url: `/API/bpm/userTask/${taskId}`,
        data: {
          assigned_id,
        },
      });
    } else console.log({error:'Tarea no asignada', taskId, assigned_id });
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
    if (!requestLinks) return;
    const requestData = requestLinks?.map((link) => {
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
  },
  async is_proccess_auth(role) {
    const bonitaUserId = Meteor.users.findOne(Meteor.userId({}))?.profile
      ?.bonitaUser;
    const memberships = await Meteor.callAsync("get_data", {
      url: "API/identity/membership?p=0&c=10&f=user_id%3D" + bonitaUserId,
      params: {},
    });
    if (memberships != "error" && memberships != "no token") {
      const roles = await memberships?.map(async (membership) => {
        const roleDescription = await Meteor.callAsync("get_data", {
          url: `/API/identity/role/${membership.role_id}`,
          params: {},
        });
        return roleDescription?.name;
      });
      const solvedRoles = await Promise.all(roles);
      return solvedRoles.includes(role);
    }
  },
  async get_application(token) {
    return await Meteor.callAsync("get_data", {
      url: `/API/living/application?p=0&c=100&f=token%3D${token}`,
      params: {},
    });
  },
  async get_processes() {
    return await Meteor.callAsync("get_data", {
      url: `/API/bpm/process?p=0&c=100`,
      params: {},
    });
  },
});
