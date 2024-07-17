import { Meteor } from "meteor/meteor";

const taskMode = {
  available:
    "/API/bpm/humanTask?p=0&c=100&f=state%3Dready&f=assigned_id%3D&f=user_id%3D",
  assigned: "/API/bpm/humanTask?p=0&c=100&f=state%3Dready&f=assigned_id%3D",
  doneTasks:
    "/API/bpm/archivedHumanTask?p=0&c=100&&f=state%3Dcompleted&f=assigned_id%3D",
};

Meteor.methods({
  async get_task_list(filter) {
    const userId = Meteor.userId({});
    if (userId) {
      const bonitaId = Meteor.users.findOne(Meteor.userId({})).profile
        .bonitaUser;
      return await Meteor.callAsync("get_data", {
        url: taskMode[filter] + bonitaId,
        params: {},
      }).catch((error) => console.error('error catching data (get_data)'));
    }
    console.log("no user id");
    return [];
  },
  async get_available_tasks() {
    const userId = Meteor.users.findOne(Meteor.userId({})).profile.bonitaUser;
    return await Meteor.callAsync("get_data", {
      url: availableTasks + userId,
      params: {},
    }).catch((error) => console.error(error));
  },
  async get_done_tasks({ bonitaUserId }) {
    return await Meteor.call("get_data", {
      url: doneTasks + bonitaUserId,
      params: {},
    });
  },
 
  async get_session() {
    return await Meteor.callAsync("get_data", {
      url: `/API/system/session/unusedId`,
      params: {},
    }).catch((error) => console.error(error));
  },
  async get_context({ taskId }) {
    return await Meteor.callAsync("get_data", {
      url: `/API/bpm/userTask/${taskId}/context`,
      params: {},
    }).catch((error) => console.error(error));
  },
  async get_task({ taskId }) {
    return await Meteor.call("get_data", {
      url: `/API/bpm/userTask/${taskId}`,
      params: {},
    });
  },
  async assign_task_to({ user, currentUser, taskId }) {
    if (currentUser) {
      const assigned_id = user == "me" ? currentUser : user || "";
      if (taskId) {
        return Meteor.callAsync("put_data", {
          url: `/API/bpm/userTask/${taskId}`,
          data: {
            assigned_id,
          },
        }).catch((error) => console.error(error));
      } else return { error: "Tarea no asignada", taskId, assigned_id };
    } else return { error: "no user" };
  },
  set_task_id({ taskId }) {
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { taskId } });
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
      }).catch((error) => console.error(error));
    });
    const allRequestData = await Promise.all(requestData);

    const response = {};
    allRequestData.forEach((data, index) => {
      response[requestLinks[index].rel] = data;
    });
    return response;
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
  async is_proccess_auth(role) {
    const resp = await Meteor.callAsync("get_my_memberships").catch((e) => {
      console.log(e);
      return [];
    });
    rolesTags = resp.flat(1);
    return rolesTags.includes(role);
  },
  async get_application(token) {
    return await Meteor.callAsync("get_data", {
      url: `/API/living/application?p=0&c=100&f=token%3D${token}`,
      params: {},
    }).catch((error) => console.error(error));
  },
  async get_processes() {
    return await Meteor.callAsync("get_data", {
      url: `/API/bpm/process?p=0&c=100`,
      params: {},
    }).catch((error) => console.error(error));
  },

});
