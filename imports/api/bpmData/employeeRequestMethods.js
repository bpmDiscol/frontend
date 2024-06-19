import { Meteor } from "meteor/meteor";
import {
  processInterviews,
  validateEmployeeRequest,
  validateRequest,
} from "../misc/validation";
import { message } from "antd";

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
  async get_employee_request_data(taskId) {
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

  async send_employee_request({
    response,
    concept,
    caseId,
  }) {
    const { username, taskId } = Meteor.users.findOne(Meteor.userId());
    const field = ["requestEmployeeDataInput", "observations"];
    Meteor.callAsync("update_data", { field, value: concept }, caseId);

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        concept,
        responsible: username,
        response,
      },
    });
  },

  async start_employee_request({ request, processId }) {
    const validRequest = validateRequest(request);
    const errorValidation = validateEmployeeRequest(validRequest);

    if (errorValidation) {
      return { error: true, issues: errorValidation.issues };
    }

    const response = await Meteor.callAsync("post_data", {
      url: `/API/bpm/process/${processId}/instantiation`,
      data: validRequest,
    });

    if (!response.error)
      Meteor.call("add_request", validRequest, response.response.caseId);
    return response;
  },

  async send_curricullums(caseId) {
    const { username, taskId } = Meteor.users.findOne(Meteor.userId());
    const curricullumTask = "employeeCurriculllums-" + taskId;
    const taskData = await Meteor.callAsync("get_task_data", curricullumTask);
    const curricullumsInput = taskData[0].curricullums;
    if (curricullumsInput.length == 0)
      return { error: true, message: "no files" };

    const field = ["curricullumsInput"];
    Meteor.callAsync("set_data", { field, value: curricullumsInput }, caseId);

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        curricullumsInput,
        responsible: username,
      },
    });
  },
  async get_curricullums() {
    const { taskId } = Meteor.users.findOne(Meteor.userId());
    const context = await Meteor.callAsync("get_context", { taskId });

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.curricullums_ref?.link,
        params: {},
      });
  },

  async send_interviews(iData, caseId) {
    const { username, taskId } = Meteor.users.findOne(Meteor.userId());
    const interviewInput = processInterviews(iData);
    const field = ["interviewInput"];
    Meteor.callAsync("set_data", { field, value: interviewInput }, caseId);

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        interviewInput,
        responsible: username,
      },
    });
  },
  async get_interviews() {
    const { taskId } = Meteor.users.findOne(Meteor.userId());
    const context = await Meteor.callAsync("get_context", { taskId });

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.interview_ref?.link,
        params: {},
      });
  },
  async get_laboralExperience({ href }) {
    return await Meteor.callAsync("get_data", {
      url: href,
      params: {},
    });
  },
  async get_link_data({ href }) {
    return await Meteor.callAsync("get_data", {
      url: href,
      params: {},
    });
  },
});
