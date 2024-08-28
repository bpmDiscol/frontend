import { Meteor } from "meteor/meteor";

const taskMode = {
  available:
    "/API/bpm/humanTask?p=0&c=100&f=state%3Dready&f=assigned_id%3D&f=user_id%3D",
  assigned: "/API/bpm/humanTask?p=0&c=100&f=state%3Dready&f=assigned_id%3D",
  doneTasks:
    "/API/bpm/archivedHumanTask?p=0&c=100&&f=state%3Dcompleted&f=assigned_id%3D",
};

Meteor.methods({
  async get_task_list(filter, user) {
    if (user) {
      const bonitaId = Meteor.users.findOne(user).profile?.bonitaUser;
      const data = await Meteor.callAsync("manage_data", "get", {
        url: taskMode[filter] + bonitaId,
        data: {},
        user,
      }).catch((error) => console.error("error catching data (get_data)"));
      return data.response;
    }
    console.log("no user id");
    return [];
  },
  async get_available_tasks(user) {
    const userId = Meteor.users.findOne(user).profile.bonitaUser;
    const data = await Meteor.callAsync("manage_data", "get", {
      url: availableTasks + userId,
      data: {},
      user,
    }).catch((error) => console.error(error));
    return data.response;
  },
  async get_done_tasks({ bonitaUserId, user }) {
    const data = await Meteor.call("manage_data", "get", {
      url: doneTasks + bonitaUserId,
      data: {},
      user,
    });
    return data.response;
  },

  async get_session(user) {
    const data = await Meteor.callAsync("manage_data", "get", {
      url: `/API/system/session/unusedId`,
      data: {},
      user,
    }).catch((error) => console.error(error));
    return data.response;
  },
  async get_context({ taskId, user }) {
    const data = await Meteor.callAsync("manage_data", "get", {
      url: `/API/bpm/userTask/${taskId}/context`,
      data: {},
      user,
    }).catch((error) => console.error(error));
    return data.response;
  },
  async get_task({ taskId, user }) {
    return await Meteor.call("manage_data", "get", {
      url: `/API/bpm/userTask/${taskId}`,
      data: {},
      user,
    });
  },
  async assign_task_to({ user, currentUser, taskId, userId }) {
    if (currentUser) {
      const assigned_id = user == "me" ? currentUser : user || "";
      if (taskId) {
        const data = Meteor.callAsync("manage_data", "put", {
          url: `/API/bpm/userTask/${taskId}`,
          data: {
            assigned_id,
          },
          user: userId,
        }).catch((error) => console.error(error));
        return data.response;
      } else return { error: "Tarea no asignada", taskId, assigned_id };
    } else return { error: "no user" };
  },
  set_task_id({ taskId, user }) {
    Meteor.users.update({ _id: user }, { $set: { taskId } });
  },
  assign_me_task() {
    Meteor.call("assing_task_to", { userId: -1 });
  },
  unasign_task() {
    Meteor.call("assing_task_to", { userId: "" });
  },
  async request_data_links({ requestLinks, user }) {
    if (!requestLinks) return;
    const requestData = requestLinks?.map((link) => {
      const data = Meteor.callAsync("manage_data", "get", {
        url: link.href,
        data: {},
        user,
      }).catch((error) => console.error(error));
      return data.response;
    });
    const allRequestData = await Promise.all(requestData);
    const response = {};
    allRequestData.forEach((data, index) => {
      response[requestLinks[index].rel] = data;
    });
    return response;
  },
  async get_my_memberships(user, bonitaUserId) {
    if (!bonitaUserId)
      bonitaUserId = Meteor.users.findOne(user)?.profile?.bonitaUser;
    if (!bonitaUserId) return [];
    const data = await Meteor.callAsync("manage_data", "get", {
      url: "API/identity/membership?p=0&c=10&f=user_id%3D" + bonitaUserId,
      data: {},
      user,
    }).catch((error) => console.error(error));
    if (data.error) {console.log("Error colectando membresias"); return []};

    const memberships = data.response;
    if (memberships != "error" && memberships != "no token") {
      const roles = await memberships?.map(async (membership) => {
        const roleDescription = await Meteor.callAsync("manage_data", "get", {
          url: `/API/identity/role/${membership.role_id}`,
          data: {},
          user,
        });

        const groupDescription = await Meteor.callAsync("manage_data", "get", {
          url: `/API/identity/group/${membership.group_id}`,
          data: {},
          user,
        });
        return [
          roleDescription?.response?.name,
          groupDescription?.response?.name,
        ];
      });
      return await Promise.all(roles);
    }
  },
  async is_proccess_auth(role, user) {
    const resp = Meteor.users.findOne(user).profile.memberships;

    if (resp?.length) {
      const authMemberships = resp.filter((membership) =>
        role.length == 1
          ? membership.includes(role[0])
          : JSON.stringify(role) === JSON.stringify(membership)
      );
      return authMemberships.length > 0;
    }
    return;
  },
  async get_application(token, user) {
    const data = await Meteor.callAsync("manage_data", "get", {
      url: `/API/living/application?p=0&c=100&f=token%3D${token}`,
      data: {},
      user,
    }).catch((error) => console.error(error));
    return data.response;
  },
  async get_processes(user) {
    const data = await Meteor.callAsync("manage_data", "get", {
      url: `/API/bpm/process?p=0&c=100`,
      data: {},
      user,
    }).catch((error) => console.error(error));
    return data.response;
  },
  async get_subordinates(user, id) {
    const data = await Meteor.callAsync("manage_data", "get", {
      url: `/API/identity/user?p=0&c=9999`,
      data: {},
      user,
    }).catch((error) => console.error(error));

    return data.response.filter((user) => user.manager_id == id);
  },
});
