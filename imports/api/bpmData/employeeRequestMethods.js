import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import {
  processInterviews,
  validateEmployeeRequest,
  validateRequest,
} from "../misc/validation";
import { requestEmployeeCollection } from "../requestEmployeData/requestEmployeeDataPublication";
import { deleteFile } from "../../ui/misc/filemanagement";

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

  async send_employee_request({ userName, response, concept, caseId, taskId }) {
    const field = ["requestEmployeeDataInput", "observations"];
    Meteor.callAsync("update_data", { field, value: concept }, caseId).catch(
      (error) => console.error(error)
    );
    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        concept,
        responsible: userName,
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
    }).catch((error) => console.error(error));

    if (!response.error)
      Meteor.callAsync(
        "add_request",
        validRequest,
        response.response.caseId
      ).catch((error) =>
        console.error("Error instanciando el proceso: " + error)
      );
    return response;
  },

  async send_curricullums(caseId, taskId, userName, taskName) {
    const curricullumTask = taskName + taskId;
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
          responsible: userName,
        },
      }).catch((error) => console.error(error));
    }
  },
  async get_curricullums(taskId) {
    const context = await Meteor.callAsync("get_context", { taskId }).catch(
      (error) => console.error(error)
    );

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.curricullums_ref?.link,
        params: {},
      }).catch((error) => console.error(error));
  },

  async send_interviews(iData, caseId, taskId, userName) {
    const interviewInput = processInterviews(iData);
    const field = ["interviewInput"];
    Meteor.callAsync(
      "set_data",
      { field, value: interviewInput },
      caseId
    ).catch((error) => console.error(error));

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        interviewInput,
        responsible: userName,
      },
    }).catch((error) => console.error(error));
  },
  async get_interviews(taskId) {
    const context = await Meteor.callAsync("get_context", { taskId }).catch(
      (error) => console.error(error)
    );

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.interview_ref?.link,
        params: {},
      }).catch((error) => console.error(error));
  },
  async get_laboralExperience({ href }) {
    return await Meteor.callAsync("get_data", {
      url: href,
      params: {},
    }).catch((error) => console.error(error));
  },
  async get_link_data({ href }) {
    return await Meteor.callAsync("get_data", {
      url: href,
      params: {},
    }).catch((error) => console.error(error));
  },
  async send_backgrounds(caseId, backgrounds) {
    const field = ["backgoundsInput"];
    Meteor.callAsync("set_data", { field, value: backgrounds }, caseId).catch(
      (error) => console.error(error)
    );
  },
  async reject_profiles(rejectedList, caseId, taskId, userName) {
    try {
      requestEmployeeCollection.update(
        { caseId },
        { $set: { "interviewInput.$[pos].selected": false } },
        {
          arrayFilters: [
            {
              "pos.interviewId": { $in: rejectedList },
            },
          ],
        }
      );
    } catch (e) {
      console.log(e);
    }

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        rejectedList,
        responsible: userName,
      },
    }).catch((error) => console.error(error));
  },
  async check_profiles(checkeds, caseId, taskId, userName) {
    try {
      requestEmployeeCollection.update(
        { caseId },
        { $set: { "interviewInput.$[pos].selected": false } },
        {
          arrayFilters: [
            {
              "pos.interviewId": { $nin: checkeds },
            },
          ],
        }
      );
    } catch (e) {
      console.log(e);
    }

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        checkeds,
        responsible: userName,
      },
    }).catch((error) => console.error(error));
  },
  async clean_unselecteds(caseId) {
    try {
      const caseData = requestEmployeeCollection.findOne({ caseId });
      const rejecteds = caseData.interviewInput
        .filter((element) => !element.selected)
        .map((case_) => case_.interviewId);

      console.log("🚀 ~ clean_unselecteds ~ rejecteds:", rejecteds);

      requestEmployeeCollection.update(
        { caseId },
        { $pull: { curricullumsInput: { fileId: { $in: rejecteds } } } }
      );
      rejecteds.forEach((id) => {
        deleteFile("curricullums", id);
      });

      requestEmployeeCollection.update(
        { caseId },
        { $pull: { interviewInput: { selected: false } } }
      );
    } catch (e) {
      console.log(e);
    }
  },
  async uploadCVfiles(cvFiles, healthRequests, caseId, taskId, responsible) {
    const field = ["cvFilesInput"];
    Meteor.callAsync("set_data", { field, value: cvFiles }, caseId).catch(
      (error) => console.error(error)
    );

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        health_responseInput: healthRequests,
        responsible
      },
    }).catch((error) => console.error(error));
  },
  async uploadHRFiles(hrFiles, userName, caseId, taskId) {
    const field = ["healthResponseInput"];
    Meteor.callAsync("set_data", { field, value: hrFiles }, caseId).catch(
      (error) => console.error(error)
    );

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: { userName },
    }).catch((error) => console.error(error));
  },
  async simpleAcceptResponse(taskName, responsible, caseId, taskId) {
    const field = [taskName];
    Meteor.callAsync("set_data", { field, value: "done" }, caseId).catch(
      (error) => console.error(error)
    );

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: { response:'done', responsible },
    }).catch((error) => console.error(error));
  },
});
