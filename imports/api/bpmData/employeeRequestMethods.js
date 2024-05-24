import { Meteor } from "meteor/meteor";

Meteor.methods({
  async get_employee_request() {
    const taskId = await Meteor.callAsync("get_task_id");
    const context = await Meteor.callAsync("get_context", { taskId });

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.requestEmployeeData_ref?.link,
        params: {},
      });
  },
  async get_request_process({ currentTask }) {
    const taskId = currentTask
      ? currentTask
      : await Meteor.callAsync("get_task_id");
    const context = await Meteor.callAsync("get_context", { taskId });

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.requestProcess_ref?.link,
        params: {},
      });
    return {};
  },

  async send_employee_request({ response, concept }) {
    const { username, taskId } = Meteor.users.findOne(Meteor.userId());
    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        concept,
        responsible: username,
        response,
      },
    });
  },
});
