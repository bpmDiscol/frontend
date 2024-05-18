import { Meteor } from "meteor/meteor";

Meteor.methods({
  async get_employee_request() {
    const taskId = await Meteor.callAsync("get_task_id");
    const context = await Meteor.callAsync("get_data", {
      url: `/API/bpm/userTask/${taskId}/context`,
      params: {},
    });

    return await Meteor.callAsync("get_data", {
      url: context.requestEmployeeData_ref.link,
      params: {},
    });
  },
  
});
