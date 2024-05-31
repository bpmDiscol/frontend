import { Meteor } from "meteor/meteor";

function justTrueInObject(attribute, keys) {
  const result = {};
  keys.forEach((key) => {
    result[key] = attribute == key ? true : false;
  });
  return result;
}

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
  async start_employee_request({ request, processId }) {
    //TODO: probar todos que todos los valores existan
    const data = {
      contractType: request.contractType,
      workingDayType: request.workingDayType,
      motive: request.motive,
      requestEmployeeDataInput: {
        site: request.site,
        companyPosition: request.companyPosition,
        area_proyect: request.area_proyect,
        isHandbookFunction: request?.isHandbookFunction||false,
        workPlace: request.workPlace,
        vacancies: parseInt(request?.vacancies || "0"),
        duration: {
          cuantity: parseInt(request?.duration?.cuantity || "0"),
          timePart: request?.duration?.timePart||"mes",
        },
        salary: parseFloat(request.salary || "0"),
        isBonus: request?.isBonus||false,
        bonusesFrecuency: {
          cuantity: parseInt(request?.bonusesFrecuency?.cuantity || "0"),
          timePart: request?.bonusesFrecuency?.timePart||"mes",
        },
        isVehicle: request?.isVehicle||false,
        vehicleType: request?.vehicleType||"" ,
        licenceType: request?.licenceType||"",
        bearingValue: parseFloat(request?.bearingValue || "0"),
        workingDay: {
          isFullTime: false,
          isPartTime: false,
          isDayTime: false,
        },
        motive: {
          isNewCharge: false,
          isEmployeeExpanding: false,
          isLicence: false,
          isNewProject: false,
          isReplacement: false,
          isEmployeeInhability: false,
        },
        contractType: {
          isContractedLabor: false,
          isUndefined: false,
          isFixedTerm: false,
          isLearning: false,
        },
        gears: request.gears,
        requirements: request?.requirements||"",
        observations: [request?.observations||""],
      },
    };
    console.log(data)
    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/process/${processId}/instantiation`,
      data,
    });
  },
  async send_curricullums({ curricullumsInput, documentDocumentInput }) {
    const { username, taskId } = Meteor.users.findOne(Meteor.userId());
    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        curricullumsInput,
        documentDocumentInput,
        responsible: username,
      },
    });
  },
});
