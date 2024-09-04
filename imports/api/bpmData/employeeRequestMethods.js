import { Meteor } from "meteor/meteor";
import {
  processInterviews,
  validateEmployeeRequest,
  validateRequest,
} from "../misc/validation";
import { requestEmployeeCollection } from "../requestEmployeData/requestEmployeeDataPublication";
import { deleteFile } from "../../ui/misc/filemanagement";

Meteor.methods({
  async get_employee_request(taskId, user) {
    const context = await Meteor.callAsync("get_context", {
      taskId,
      user,
    }).catch((error) => console.error(error));

    if (context) {
      const data = await Meteor.callAsync("manage_data", "get", {
        url: context?.requestEmployeeData_ref?.link,
        data: {},
        user,
      }).catch((error) => console.error(error));
      return data.response;
    }
  },
  async get_employee_request_data(taskId, user) {
    const context = await Meteor.callAsync("get_context", {
      taskId,
      user,
    }).catch((error) =>
      console.error("catch get_employee_request_data(taskId) {")
    );

    if (context) {
      const data = await Meteor.callAsync("manage_data", "get", {
        url: context?.requestEmployeeData_ref?.link,
        data: {},
        user,
      }).catch((error) => console.error(error));
      return data.response;
    }
  },

  async get_request_process({ currentTask, user }) {
    const taskId = currentTask;
    const context = await Meteor.callAsync("get_context", {
      taskId,
      user,
    }).catch((error) => console.error(error));

    if (context) {
      const data = await Meteor.callAsync("manage_data", "get", {
        url: context?.requestProcess_ref?.link,
        data: {},
        user,
      }).catch((error) => console.error(error));
      return data.response;
    }
    return {};
  },

  async send_employee_request({
    userName,
    response,
    concept,
    ANS = {},
    caseId,
    taskId,
    user,
    humanResources = false,
  }) {
    const field = ["requestEmployeeDataInput", "observations"];
    Meteor.callAsync("update_data", { field, value: concept }, caseId).catch(
      (error) => console.error(error)
    );
    if (humanResources)
      Meteor.callAsync(
        "update_data",
        {
          field: ["requestEmployeeDataInput", "approvedHHRR"],
          value: Date.now(),
        },
        caseId
      ).catch((error) => console.error(error));

    requestEmployeeCollection.update(
      { caseId: caseId },
      {
        $set: {
          [humanResources ? "responseHHRR" : "responseDirector"]: response,
          ANS,
        },
      },
      { upsert: true }
    );

    return await Meteor.callAsync("manage_data", "post", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        concept,
        responsible: userName,
        response,
      },
      user,
    });
  },

  async start_employee_request({ request, processId, user }) {
    const validRequest = validateRequest(request);
    const errorValidation = validateEmployeeRequest(validRequest);

    if (errorValidation) {
      return { error: true, issues: errorValidation.issues };
    }

    const response = await Meteor.callAsync("manage_data", "post", {
      url: `/API/bpm/process/${processId}/instantiation`,
      data: validRequest,
      user,
    }).catch((error) => console.error(error));
    if (!response?.error)
      Meteor.callAsync(
        "add_request",
        validRequest,
        response.response.caseId
      ).catch((error) =>
        console.error("Error instanciando el proceso: " + error)
      );
    return response;
  },

  async send_curricullums(caseId, taskId, userName, taskName, user) {
    const curricullumTask = taskName + taskId;
    const taskData = await Meteor.callAsync(
      "get_task_data",
      curricullumTask,
      user
    ).catch((error) => console.error(error));
    if (taskData?.length) {
      const curricullumsInput = taskData[0].curricullums;
      if (curricullumsInput.length == 0)
        return { error: true, message: "no files" };

      const field = ["curricullumsInput"];

      const curricullumsCorrecteds = curricullumsInput.map((curricullum) => ({
        applicantName: curricullum.applicantName,
        applicantMidname: curricullum.applicantMidname,
        applicantLastname: curricullum.applicantLastname,
        foundBy: curricullum.foundBy,
        fileId: curricullum?.file?.uid,
        isSelected:
          !Object.keys(curricullum).includes("isSelected") ||
          curricullum.isSelected
            ? true
            : false,
        nit: curricullum.nit,
      }));

      Meteor.callAsync(
        "set_data",
        { field, value: curricullumsCorrecteds },
        caseId
      ).catch((error) => console.error(error));

      return await Meteor.callAsync("manage_data", "post", {
        url: `/API/bpm/userTask/${taskId}/execution`,
        data: {
          curricullumsInput: curricullumsCorrecteds,
          responsible: userName,
        },
        user,
      }).catch((error) => console.error(error));
    }
  },
  async get_curricullums(taskId, user) {
    const context = await Meteor.callAsync("get_context", {
      taskId,
      user,
    }).catch((error) => console.error(error));

    if (context) {
      const data = await Meteor.callAsync("manage_data", "get", {
        url: context?.curricullums_ref?.link,
        data: {},
        user,
      }).catch((error) => console.error(error));
      return data.response;
    }
  },
  async get_case(case_) {
    const caseId = typeof case_ == "string" ? parseInt(case_) : case_;
    return requestEmployeeCollection.findOne({ caseId });
  },
  update_selected({ isSelected, fileId, taskId }) {
    Meteor.users.update(
      this.userId,
      {
        $set: { [`tasks.$[task].${fileId}.selected`]: isSelected },
      },
      {
        arrayFilters: [{ "task.taskId": taskId }],
      }
    );
  },
  async send_interviews(iData, caseId, taskId, userName, user) {
    const interviewInput = processInterviews(iData);
    const field = ["interviewInput"];
    Meteor.callAsync(
      "set_data",
      { field, value: interviewInput },
      caseId
    ).catch((error) => console.error(error));

    return await Meteor.callAsync("manage_data", "post", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        interviewInput,
        responsible: userName,
      },
      user,
    }).catch((error) => console.error(error));
  },
  async get_interviews(taskId, user) {
    const context = await Meteor.callAsync("get_context", {
      taskId,
      user,
    }).catch((error) => console.error(error));

    if (context) {
      const data = await Meteor.callAsync("manage_data", "get", {
        url: context?.interview_ref?.link,
        data: {},
        user,
      }).catch((error) => console.error(error));
      return data.response;
    }
  },
  async get_laboralExperience({ href, user }) {
    const data = await Meteor.callAsync("manage_data", "get", {
      url: href,
      data: {},
      user,
    }).catch((error) => console.error(error));
    return data.response;
  },
  async get_link_data({ href, user }) {
    const data = await Meteor.callAsync("manage_data", "get", {
      url: href,
      data: {},
      user,
    }).catch((error) => console.error(error));
    return data.response;
  },
  async send_backgrounds(caseId, backgrounds) {
    const field = ["backgoundsInput"];
    Meteor.callAsync("set_data", { field, value: backgrounds }, caseId).catch(
      (error) => console.error(error)
    );
  },
  async reject_profiles(
    rejectedList,
    auxiliarId,
    caseId,
    taskId,
    userName,
    user
  ) {
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

    return await Meteor.callAsync("manage_data", "post", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        rejectedList,
        responsible: userName,
        auxiliarId,
      },
      user,
    }).catch((error) => console.error(error));
  },
  async check_profiles(checkeds, caseId, taskId, userName, user) {
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

    return await Meteor.callAsync("manage_data", "post", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        checkeds,
        responsible: userName,
      },
      user,
    }).catch((error) => console.error(error));
  },
  async add_leader_concepts(
    tecnicalknowledge,
    learningAdaptation,
    tecnicalEvaluation,
    caseId,
    interviewId
  ) {
    try {
      requestEmployeeCollection.update(
        { caseId },
        {
          $set: {
            "interviewInput.$[pos].tecnicalknowledge": tecnicalknowledge,
            "interviewInput.$[pos].learningAdaptation": learningAdaptation,
            "interviewInput.$[pos].tecnicalEvaluation": tecnicalEvaluation,
          },
        },
        {
          arrayFilters: [{ "pos.interviewId": interviewId }],
        }
      );
    } catch (e) {
      console.log(e);
    }
  },
  async update_salary(caseId, salary) {
    requestEmployeeCollection.update(
      {caseId},
      {
        $set: { "requestEmployeeDataInput.salary": salary },
      },
      { upsert: true }
    );
  },
  async add_salary(salary, caseId, interviewId) {
    try {
      requestEmployeeCollection.update(
        { caseId },
        { $set: { "interviewInput.$[pos].salary": salary } },
        { arrayFilters: [{ "pos.interviewId": interviewId }] }
      );
    } catch (e) {
      console.log(e);
    }
  },
  async get_salary(caseId, interviewId) {
    const data = requestEmployeeCollection.findOne({ caseId });
    const interview = data.interviewInput.filter(
      (interview) => interview.interviewId == interviewId
    );
    if (interview.salary) return interview.salary;
    return data.requestEmployeeDataInput.salary;
  },
  async clean_unselecteds(caseId) {
    try {
      const caseData = requestEmployeeCollection.findOne({ caseId });
      const rejecteds = caseData.interviewInput
        .filter((element) => !element.selected)
        .map((case_) => case_.interviewId);

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
  async uploadCVfiles(
    cvFiles,
    healthRequests,
    caseId,
    taskId,
    responsible,
    user
  ) {
    const field = ["cvFilesInput"];
    Meteor.callAsync("set_data", { field, value: cvFiles }, caseId).catch(
      (error) => console.error(error)
    );

    return await Meteor.callAsync("manage_data", "post", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        health_responseInput: healthRequests,
        responsible,
      },
      user,
    }).catch((error) => console.error(error));
  },
  async uploadNominaFiles(caseId, value, memberId) {
    Meteor.callAsync(
      "set_data",
      { field: ["cvFilesInput", memberId], value },
      caseId
    ).catch((error) => console.error(error));
  },
  async uploadHRFiles(hrFiles, userName, caseId, taskId, user) {
    const field = ["healthResponseInput"];
    Meteor.callAsync("set_data", { field, value: hrFiles }, caseId).catch(
      (error) => console.error(error)
    );

    return await Meteor.callAsync("manage_data", "post", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: { userName },
      user,
    }).catch((error) => console.error(error));
  },
  async simpleAcceptResponse(taskName, responsible, caseId, taskId, user) {
    const field = [taskName];
    Meteor.callAsync("set_data", { field, value: "done" }, caseId).catch(
      (error) => console.error(error)
    );

    return await Meteor.callAsync("manage_data", "post", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: { response: "done", responsible },
      user,
    }).catch((error) => console.error(error));
  },
  async get_ANS(processIds) {
    return await requestEmployeeCollection
      .rawCollection()
      .aggregate([
        { $match: { caseId: { $in: processIds } } },
        {
          $group: {
            _id: null,
            minHHrr: { $min: "$ANS.hhrr" },
            maxHHrr: { $max: "$ANS.hhrr" },
            list: {
              $push: {
                caseId: "$caseId",
                hhrr: "$ANS.hhrr",
                isTech: {
                  $cond: {
                    if: { $eq: ["$ANS.isTechInterview", true] },
                    then: 3,
                    else: 1,
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            minHHrr: 1,
            maxHHrr: 1,
            list: 1,
          },
        },
      ])
      .toArray();
  },
});
