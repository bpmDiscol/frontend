import { Meteor } from "meteor/meteor";
import {
  processInterviews,
  validateEmployeeRequest,
  validateRequest,
} from "../misc/validation";

Meteor.methods({
  async get_employee_request(taskId) {
    const context = await Meteor.callAsync("get_context", { taskId }).catch(
      (error) => console.error(error)
    );

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.requestEmployeeData_ref?.link,
        params: {},
      }).catch((error) => console.error(error));
  },
  async get_employee_request_data(taskId) {
    const context = await Meteor.callAsync("get_context", { taskId }).catch(
      (error) => console.error(error)
    );

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.requestEmployeeData_ref?.link,
        params: {},
      }).catch((error) => console.error(error));
  },

  async get_request_process({ currentTask }) {
    const taskId = currentTask;
    const context = await Meteor.callAsync("get_context", { taskId }).catch(
      (error) => console.error(error)
    );

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.requestProcess_ref?.link,
        params: {},
      }).catch((error) => console.error(error));
    return {};
  },

  async send_employee_request({ response, concept, caseId, taskId }) {
    const { username } = Meteor.users.findOne(Meteor.userId());
    const field = ["requestEmployeeDataInput", "observations"];
    Meteor.callAsync("update_data", { field, value: concept }, caseId).catch(
      (error) => console.error(error)
    );
    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        concept,
        responsible: username,
        response,
      },
    })
  },

  async start_employee_request({ request, processId }) {
    const validRequest = validateRequest(request);
    const errorValidation = validateEmployeeRequest(validRequest);
    
    if (errorValidation) {
      return { error: true, issues: errorValidation.issues };
    }
    
    console.log("🚀 ~ start_employee_request ~ validRequest:", validRequest)

    const response = await Meteor.callAsync("post_data", {
      url: `/API/bpm/process/${processId}/instantiation`,
      data: validRequest,
    }).catch((error) => console.error(error));

    if (!response.error)
      Meteor.callAsync(
        "add_request",
        validRequest,
        response.response.caseId
      ).catch((error) => console.error("Error instanciando el proceso: "+ error));
    return response;
  },

  async send_curricullums(caseId, taskId) {
    const { username } = Meteor.users.findOne(Meteor.userId());
    const curricullumTask = "employeeCurriculllums-" + taskId;
    const taskData = await Meteor.callAsync(
      "get_task_data",
      curricullumTask
    ).catch((error) => console.error(error));
    if (taskData?.length) {
      const curricullumsInput = taskData[0].curricullums;
      if (curricullumsInput.length == 0)
        return { error: true, message: "no files" };

      const field = ["curricullumsInput"];
      Meteor.callAsync(
        "set_data",
        { field, value: curricullumsInput },
        caseId
      ).catch((error) => console.error(error));

      return await Meteor.callAsync("post_data", {
        url: `/API/bpm/userTask/${taskId}/execution`,
        data: {
          curricullumsInput,
          responsible: username,
        },
      }).catch((error) => console.error(error));
    }
  },
  async get_curricullums(taskId) {
    const context = await Meteor.callAsync("get_context", { taskId }).catch(error=> console.error(error));

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.curricullums_ref?.link,
        params: {},
      }).catch(error=> console.error(error));
  },

  async send_interviews(iData, caseId, taskId) {
    const { username } = Meteor.users.findOne(Meteor.userId());
    const interviewInput = processInterviews(iData);
    const field = ["interviewInput"];
    Meteor.callAsync("set_data", { field, value: interviewInput }, caseId).catch(error=> console.error(error));

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        interviewInput,
        responsible: username,
      },
    }).catch(error=> console.error(error));
  },
  async get_interviews(taskId) {
    const context = await Meteor.callAsync("get_context", { taskId }).catch(error=> console.error(error));

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.interview_ref?.link,
        params: {},
      }).catch(error=> console.error(error));
  },
  async get_laboralExperience({ href }) {
    return await Meteor.callAsync("get_data", {
      url: href,
      params: {},
    }).catch(error=> console.error(error));
  },
  async get_link_data({ href }) {
    return await Meteor.callAsync("get_data", {
      url: href,
      params: {},
    }).catch(error=> console.error(error));
  },
});
